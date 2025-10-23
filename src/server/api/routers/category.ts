import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../../trpc/server";
import { categories } from "../../db/schema";

export const categoryRouter = createTRPCRouter({
  /**
   * Query to get all categories from the database.
   */
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  /**
   * Mutation to create a new category.
   */
  createCategory: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Attempting to create category:", input.name);
        const [newCategory] = await ctx.db
          .insert(categories)
          .values({
            // The `id` is now handled by the database automatically.
            name: input.name,
            slug: input.name.toLowerCase().replace(/\s+/g, "-"),
          })
          .returning(); // Good practice to return the created item

        console.log("Successfully created category:", newCategory);
        return newCategory;
      } catch (error) {
        console.error("DATABASE ERROR creating category:", error);
        // Re-throw the error to be handled by tRPC
        throw new Error("Failed to create category in the database.");
      }
    }),
});

