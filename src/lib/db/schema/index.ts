export * from "./user";
export * from "./session";
export * from "./account";
export * from "./verification";
export * from "./guest";
export * from "./types";

// Export types for each table
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { users, sessions, accounts, verifications, guests } from ".";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Verification = InferSelectModel<typeof verifications>;
export type NewVerification = InferInsertModel<typeof verifications>;

export type Guest = InferSelectModel<typeof guests>;
export type NewGuest = InferInsertModel<typeof guests>;
