import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { products } from "./products";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsToCollections = pgTable("products_to_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(productsToCollections),
}));

export const productsToCollectionsRelations = relations(productsToCollections, ({ one }) => ({
  product: one(products, { fields: [productsToCollections.productId], references: [products.id] }),
  collection: one(collections, { fields: [productsToCollections.collectionId], references: [collections.id] }),
}));

export const insertCollectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(150),
  slug: z.string().min(1).max(150),
  createdAt: z.date().optional(),
});

export const selectCollectionSchema = insertCollectionSchema;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = z.infer<typeof selectCollectionSchema>;

export const insertProductToCollectionSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const selectProductToCollectionSchema = insertProductToCollectionSchema;

export type InsertProductToCollection = z.infer<typeof insertProductToCollectionSchema>;
export type ProductToCollection = z.infer<typeof selectProductToCollectionSchema>;


