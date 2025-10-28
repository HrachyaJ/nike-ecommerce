import { timestamp } from "drizzle-orm/pg-core";

// Base timestamp columns for all tables
export const baseTimestampColumns = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};
