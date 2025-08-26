import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { baseTimestampColumns } from "./types";
import { users } from "./user";

export const sessions = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull(),
  ...baseTimestampColumns,
});
