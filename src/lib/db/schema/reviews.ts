import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { products } from "./products";
import { users } from "./user";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const insertReviewSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  createdAt: z.date().optional(),
});

export const selectReviewSchema = insertReviewSchema;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = z.infer<typeof selectReviewSchema>;


