import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/lib/db/schema/index";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // This allows sign in without verification
    autoSignIn: true, // Automatically sign in after sign up
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      emailVerified: {
        type: "boolean",
        defaultValue: false, // Users start unverified but can still sign in
        required: false,
      },
    },
  },
  advanced: {
    generateId: () => uuidv4(),
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  plugins: [nextCookies()],
});
