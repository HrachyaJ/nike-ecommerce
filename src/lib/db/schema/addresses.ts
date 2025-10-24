import { pgEnum, pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { users } from "./user";

export const addressTypeEnum = pgEnum("address_type", ["billing", "shipping"]);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: addressTypeEnum("type").notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  line2: varchar("line2", { length: 255 }),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 120 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const insertAddressSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(["billing", "shipping"]),
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).optional().nullable(),
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(120),
  country: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(20),
  isDefault: z.boolean().default(false),
});

export const selectAddressSchema = insertAddressSchema;

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = z.infer<typeof selectAddressSchema>;


