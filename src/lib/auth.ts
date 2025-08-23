// Better Auth configuration - Ready to implement
// This file provides the foundation for adding authentication to your app

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

// Export the adapter for use in auth configuration
export const authAdapter = DrizzleAdapter(db);

// Example auth configuration (uncomment and configure when ready)
/*
import { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    // Add your authentication providers here
    // Example: Google, GitHub, etc.
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
};
*/
