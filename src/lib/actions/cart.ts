"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  productVariants,
  products,
  productImages,
  guests,
  type Cart,
  type CartItem,
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { createGuestSession, guestSession } from "@/lib/auth/actions";

type CartWithItems = Cart & {
  items: (CartItem & {
    variant: {
      id: string;
      price: string;
      salePrice: string | null;
      product: { id: string; name: string };
      imageUrl: string | null;
    };
  })[];
};

async function getOrCreateActiveCart(): Promise<{ cartId: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user?.id) {
    const existing = await db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
    });
    if (existing) return { cartId: existing.id };
    const inserted = await db
      .insert(carts)
      .values({ userId: session.user.id })
      .returning({ id: carts.id });
    return { cartId: inserted[0].id };
  }

  // Guest flow
  const { sessionToken } = await guestSession();
  const token = sessionToken ?? (await createGuestSession()).sessionToken;
  if (!token) return null;

  const guest = await db.query.guests.findFirst({
    where: eq(guests.sessionToken, token),
  });
  if (!guest) return null;

  const existing = await db.query.carts.findFirst({
    where: eq(carts.guestId, guest.id),
  });
  if (existing) return { cartId: existing.id };
  const inserted = await db
    .insert(carts)
    .values({ guestId: guest.id })
    .returning({ id: carts.id });
  return { cartId: inserted[0].id };
}

export async function getCart(): Promise<CartWithItems> {
  const base = await getOrCreateActiveCart();
  if (!base) return { id: "", items: [], createdAt: new Date(), updatedAt: new Date() } as unknown as CartWithItems;

  // Subquery to pick exactly one image per product (primary > sortOrder)
  const pi = db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      rn: sql<number>`row_number() over (partition by ${productImages.productId} order by ${productImages.isPrimary} desc, ${productImages.sortOrder} asc, ${productImages.id} asc)`.as(
        "rn",
      ),
    })
    .from(productImages)
    .as("pi");

  const items = await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productVariantId: cartItems.productVariantId,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
      productId: products.id,
      name: products.name,
      imageUrl: pi.url,
    })
    .from(cartItems)
    .leftJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(pi, and(eq(pi.productId, products.id), eq(pi.rn, 1)))
    .where(eq(cartItems.cartId, base.cartId));

  const mapped: CartWithItems = {
    id: base.cartId,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: items.map((i) => ({
      id: i.id,
      cartId: i.cartId,
      productVariantId: i.productVariantId,
      quantity: i.quantity,
      variant: {
        id: i.variantId,
        price: i.price,
        salePrice: i.salePrice,
        product: { id: i.productId, name: i.name },
        imageUrl: i.imageUrl ?? null,
      },
    })),
  } as CartWithItems;
  return mapped;
}

export async function addCartItem(variantId: string, quantity = 1) {
  const cart = await getOrCreateActiveCart();
  if (!cart) return { ok: false } as const;

  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.cartId), eq(cartItems.productVariantId, variantId)),
  });

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId: cart.cartId, productVariantId: variantId, quantity });
  }
  return { ok: true } as const;
}

export async function updateCartItem(itemId: string, quantity: number) {
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  return { ok: true } as const;
}

export async function removeCartItem(itemId: string) {
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
  return { ok: true } as const;
}

export async function clearCart() {
  const base = await getOrCreateActiveCart();
  if (!base) return { ok: true } as const;
  await db.delete(cartItems).where(eq(cartItems.cartId, base.cartId));
  return { ok: true } as const;
}

export async function mergeGuestCartWithUserCart() {
  // Called after login/signup
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { ok: true } as const;

  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) return { ok: true } as const;

  const guest = await db.query.guests.findFirst({ where: eq(guests.sessionToken, token) });
  if (!guest) return { ok: true } as const;

  const guestCart = await db.query.carts.findFirst({ where: eq(carts.guestId, guest.id) });
  if (!guestCart) return { ok: true } as const;

  const userCart = await db.query.carts.findFirst({ where: eq(carts.userId, session.user.id) });
  const targetCartId = userCart
    ? userCart.id
    : (await db.insert(carts).values({ userId: session.user.id }).returning({ id: carts.id }))[0].id;

  if (guestCart.id !== targetCartId) {
    const guestItems = await db.query.cartItems.findMany({ where: eq(cartItems.cartId, guestCart.id) });
    for (const gi of guestItems) {
      const existing = await db.query.cartItems.findFirst({
        where: and(eq(cartItems.cartId, targetCartId), eq(cartItems.productVariantId, gi.productVariantId)),
      });
      if (existing) {
        await db
          .update(cartItems)
          .set({ quantity: existing.quantity + gi.quantity })
          .where(eq(cartItems.id, existing.id));
      } else {
        await db.insert(cartItems).values({ cartId: targetCartId, productVariantId: gi.productVariantId, quantity: gi.quantity });
      }
    }
    await db.delete(carts).where(eq(carts.id, guestCart.id));
  }

  (await cookieStore).delete("guest_session");
  return { ok: true } as const;
}


