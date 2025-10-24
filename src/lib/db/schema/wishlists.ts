import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { users } from "./user";
import { products } from "./products";

export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, { fields: [wishlists.productId], references: [products.id] }),
}));

export const insertWishlistSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date().optional(),
});

export const selectWishlistSchema = insertWishlistSchema;

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = z.infer<typeof selectWishlistSchema>;


