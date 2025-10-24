"use server";

import { db } from "@/lib/db";
import { carts, cartItems, guests } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

/**
 * Merges guest cart with user cart if user is authenticated
 * This should be called before creating a Stripe checkout session
 */
export async function mergeGuestCartWithUserCart(): Promise<{ cartId: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    // User not authenticated, return guest cart
    return await getGuestCart();
  }

  const cookieStore = await cookies();
  const guestToken = (await cookieStore).get("guest_session")?.value;
  
  if (!guestToken) {
    // No guest session, return user cart
    return await getUserCart(session.user.id);
  }

  const guest = await db.query.guests.findFirst({
    where: eq(guests.sessionToken, guestToken),
  });

  if (!guest) {
    // Invalid guest session, return user cart
    return await getUserCart(session.user.id);
  }

  const guestCart = await db.query.carts.findFirst({
    where: eq(carts.guestId, guest.id),
  });

  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, session.user.id),
  });

  if (!guestCart) {
    // No guest cart, return user cart
    return await getUserCart(session.user.id);
  }

  if (!userCart) {
    // No user cart, convert guest cart to user cart
    await db
      .update(carts)
      .set({ 
        userId: session.user.id,
        guestId: null 
      })
      .where(eq(carts.id, guestCart.id));

    // Clean up guest session
    await db.delete(guests).where(eq(guests.id, guest.id));
    (await cookieStore).delete("guest_session");

    return { cartId: guestCart.id };
  }

  // Both carts exist, merge guest items into user cart
  const guestItems = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, guestCart.id),
  });

  for (const guestItem of guestItems) {
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productVariantId, guestItem.productVariantId)
      ),
    });

    if (existingItem) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + guestItem.quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Add new item to user cart
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productVariantId: guestItem.productVariantId,
        quantity: guestItem.quantity,
      });
    }
  }

  // Clean up guest cart and session
  await db.delete(carts).where(eq(carts.id, guestCart.id));
  await db.delete(guests).where(eq(guests.id, guest.id));
  (await cookieStore).delete("guest_session");

  return { cartId: userCart.id };
}

async function getGuestCart(): Promise<{ cartId: string } | null> {
  const cookieStore = await cookies();
  const guestToken = (await cookieStore).get("guest_session")?.value;
  
  if (!guestToken) return null;

  const guest = await db.query.guests.findFirst({
    where: eq(guests.sessionToken, guestToken),
  });

  if (!guest) return null;

  const cart = await db.query.carts.findFirst({
    where: eq(carts.guestId, guest.id),
  });

  return cart ? { cartId: cart.id } : null;
}

async function getUserCart(userId: string): Promise<{ cartId: string } | null> {
  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  });

  if (cart) return { cartId: cart.id };

  // Create new user cart
  const newCart = await db
    .insert(carts)
    .values({ userId })
    .returning({ id: carts.id });

  return { cartId: newCart[0].id };
}
