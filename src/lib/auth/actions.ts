"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { guests } from "@/lib/db/schema/index";
import { and, eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../db";
import { auth } from ".";

function extractErrorBodyMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    const maybe = error as { body?: { message?: string } } | undefined;
    return maybe?.body?.message ?? "";
  } catch {
    return "";
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // Changed from strict to lax for better compatibility
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
} as const;

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters");
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .trim();

type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createGuestSession(): Promise<
  ActionResponse<{ sessionToken: string }>
> {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get("guest_session");

    if (existing?.value) {
      // Verify the session still exists and is valid
      const guest = await db.query.guests.findFirst({
        where: and(
          eq(guests.sessionToken, existing.value),
          lt(guests.expiresAt, new Date())
        ),
      });

      if (guest) {
        return { success: true, data: { sessionToken: existing.value } };
      }
    }

    const sessionToken = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

    await db.insert(guests).values({
      sessionToken,
      expiresAt,
    });

    cookieStore.set("guest_session", sessionToken, COOKIE_OPTIONS);
    return { success: true, data: { sessionToken } };
  } catch (error) {
    console.error("Failed to create guest session:", error);
    return {
      success: false,
      error: "Failed to create session. Please try again.",
    };
  }
}

export async function guestSession(): Promise<{ sessionToken: string | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("guest_session")?.value;

    if (!token) {
      return { sessionToken: null };
    }

    const now = new Date();

    // Check if session is valid before returning
    const validGuest = await db.query.guests.findFirst({
      where: and(eq(guests.sessionToken, token), lt(guests.expiresAt, now)),
    });

    if (!validGuest) {
      // Clean up invalid session
      cookieStore.delete("guest_session");
      await db
        .delete(guests)
        .where(eq(guests.sessionToken, token))
        .catch(() => {}); // Ignore errors on cleanup
      return { sessionToken: null };
    }

    // Clean up expired sessions (async, don't wait)
    db.delete(guests)
      .where(lt(guests.expiresAt, now))
      .catch(() => {}); // Ignore errors on cleanup

    return { sessionToken: token };
  } catch (error) {
    console.error("Failed to get guest session:", error);
    return { sessionToken: null };
  }
}

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export async function signUp(
  formData: FormData
): Promise<ActionResponse<{ userId: string }>> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validation = signUpSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return { success: false, error: firstError.message };
    }

    const data = validation.data;

    // Attempt to sign up
    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: await headers(),
    });

    if (!res.user) {
      return {
        success: false,
        error: "Failed to create account. Please try again.",
      };
    }

    // Migrate guest data if exists
    await migrateGuestToUser();

    return {
      success: true,
      data: {
        userId: res.user.id,
      },
    };
  } catch (error: unknown) {
    console.error("Sign up error:", error);

    // Handle common errors
    const errorMessage =
      error instanceof Error ? error.message : extractErrorBodyMessage(error);

    if (
      errorMessage.includes("already exists") ||
      errorMessage.includes("duplicate") ||
      errorMessage.includes("unique constraint")
    ) {
      return {
        success: false,
        error:
          "An account with this email already exists. Please sign in instead.",
      };
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }

    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
}

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signIn(
  formData: FormData
): Promise<ActionResponse<{ userId: string }>> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validation = signInSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return { success: false, error: firstError.message };
    }

    const data = validation.data;

    // Attempt to sign in
    const res = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!res.user) {
      return { success: false, error: "Invalid email or password." };
    }

    // Migrate guest data if exists
    await migrateGuestToUser();

    return {
      success: true,
      data: {
        userId: res.user.id,
      },
    };
  } catch (error: unknown) {
    console.error("Sign in error:", error);

    // Handle common errors
    const errorMessage =
      error instanceof Error ? error.message : extractErrorBodyMessage(error);

    if (
      errorMessage.includes("credentials") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("password") ||
      errorMessage.includes("Incorrect")
    ) {
      return { success: false, error: "Invalid email or password." };
    }

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("No user")
    ) {
      return {
        success: false,
        error: "No account found with this email. Please sign up first.",
      };
    }

    if (
      errorMessage.includes("verified") ||
      errorMessage.includes("verification")
    ) {
      return {
        success: false,
        error: "Please verify your email before signing in.",
      };
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }

    return {
      success: false,
      error: "Failed to sign in. Please try again.",
    };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user ?? null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out. Please try again." };
  }
}

export async function mergeGuestCartWithUserCart(): Promise<ActionResponse> {
  try {
    await migrateGuestToUser();
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to merge cart:", error);
    return { success: false, error: "Failed to merge cart data." };
  }
}

async function migrateGuestToUser(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("guest_session")?.value;

    if (!token) return;

    // Delete guest session from database
    await db.delete(guests).where(eq(guests.sessionToken, token));

    // Delete guest cookie
    cookieStore.delete("guest_session");
  } catch (error) {
    console.error("Failed to migrate guest data:", error);
    // Don't throw - this shouldn't block auth
  }
}
