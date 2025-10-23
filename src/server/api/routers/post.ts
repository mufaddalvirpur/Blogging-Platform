import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../../trpc/server";
import { posts, postsToCategories } from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// A simple function to generate a URL-friendly slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const postRouter = createTRPCRouter({
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        categoryIds: z.array(z.number()),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const postId = createId();
      const postSlug = createSlug(input.title);
      const now = new Date();

      await ctx.db.insert(posts).values({
        id: postId,
        title: input.title,
        content: input.content,
        slug: postSlug,
        published: input.published,
        createdAt: now,
        updatedAt: now,
      });

      if (input.categoryIds.length > 0) {
        await ctx.db.insert(postsToCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: postId,
            categoryId: categoryId,
          })),
        );
      }

      return { success: true };
    }),

  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        includeDrafts: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, includeDrafts } = input;
      const conditions = [];

      // Filter by published status unless drafts are included
      if (!includeDrafts) {
        conditions.push(eq(posts.published, true));
      }

      // Filter by category if a categoryId is provided
      if (categoryId) {
        const postIdsResponse = await ctx.db
          .select({ postId: postsToCategories.postId })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, categoryId));

        if (postIdsResponse.length === 0) {
          return []; // No posts in this category, return early
        }
        const postIds = postIdsResponse.map((p) => p.postId);
        conditions.push(inArray(posts.id, postIds));
      }

      return ctx.db.query.posts.findMany({
        with: {
          postsToCategories: {
            with: {
              category: true,
            },
          },
        },
        // Apply all conditions, or none if the array is empty
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postsToCategories: {
            with: {
              category: true,
            },
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        categoryIds: z.array(z.number()),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(posts)
        .set({
          title: input.title,
          content: input.content,
          slug: createSlug(input.title),
          published: input.published,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id));

      await ctx.db
        .delete(postsToCategories)
        .where(eq(postsToCategories.postId, input.id));

      if (input.categoryIds.length > 0) {
        await ctx.db.insert(postsToCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: input.id,
            categoryId: categoryId,
          })),
        );
      }

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(postsToCategories)
        .where(eq(postsToCategories.postId, input.id));

      await ctx.db.delete(posts).where(eq(posts.id, input.id));

      return { success: true };
    }),
});

