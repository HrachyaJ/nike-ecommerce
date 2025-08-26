import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { baseTimestampColumns } from "./types";
import { users } from "./user";

export const accounts = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: varchar("access_token", { length: 255 }),
  refreshToken: varchar("refresh_token", { length: 255 }),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 255 }),
  idToken: varchar("id_token", { length: 255 }),
  password: varchar("password", { length: 255 }),
  ...baseTimestampColumns,
});
