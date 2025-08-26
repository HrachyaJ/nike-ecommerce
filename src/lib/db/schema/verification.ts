import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { baseTimestampColumns } from "./types";

export const verifications = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...baseTimestampColumns,
});
