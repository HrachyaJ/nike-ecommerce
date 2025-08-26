import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { baseTimestampColumns } from "./types";

export const guests = pgTable("guest", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ...baseTimestampColumns,
});
