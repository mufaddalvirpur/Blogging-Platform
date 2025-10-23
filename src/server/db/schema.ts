import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: varchar("id", { length: 24 }).notNull().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
});

export const postsToCategories = pgTable(
  "posts_to_categories",
  {
    postId: varchar("post_id", { length: 24 })
      .notNull()
      .references(() => posts.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  }),
);

export const postsRelations = relations(posts, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(
  postsToCategories,
  ({ one }) => ({
    post: one(posts, {
      fields: [postsToCategories.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [postsToCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

