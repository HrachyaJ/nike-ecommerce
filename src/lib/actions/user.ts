import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/user";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string().url().optional().nullable(),
});

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  const validated = updateProfileSchema.parse(data);

  await db
    .update(users)
    .set({
      name: validated.name,
      email: validated.email,
      image: validated.image,
    })
    .where(eq(users.email, validated.email));

  return { success: true };
}

export type UserPreferences = {
  marketingEmails: boolean;
  orderUpdates: boolean;
  newsAndOffers: boolean;
  language: string;
  currency: string;
};

export async function updateUserPreferences() {
  // Store preferences in the database
  // You might want to create a new table for user preferences
  return { success: true };
}
