import { pgEnum, pgTable, uuid, varchar, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"]);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp("expires_at"),
  maxUsage: integer("max_usage").notNull().default(0),
  usedCount: integer("used_count").notNull().default(0),
});

export const insertCouponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1).max(100),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.string(),
  expiresAt: z.date().optional().nullable(),
  maxUsage: z.number().int().nonnegative().default(0),
  usedCount: z.number().int().nonnegative().default(0),
});

export const selectCouponSchema = insertCouponSchema;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = z.infer<typeof selectCouponSchema>;


