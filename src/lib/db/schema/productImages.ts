import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { products } from "./products";
import { productVariants } from "./variants";

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  url: varchar("url", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [productImages.variantId], references: [productVariants.id] }),
}));

export const insertProductImageSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional().nullable(),
  url: z.string().min(1),
  sortOrder: z.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
});

export const selectProductImageSchema = insertProductImageSchema;

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = z.infer<typeof selectProductImageSchema>;


