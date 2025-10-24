"use server";

import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  addresses,
  products,
  productVariants,
  productImages,
  users,
} from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/actions";

export async function getUserOrders() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Not authenticated", data: null };
    }

    const userOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        shippingAddress: addresses,
      })
      .from(orders)
      .leftJoin(addresses, eq(orders.shippingAddressId, addresses.id))
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order with images
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        // Subquery to get primary image for each product
        const pi = db
          .select({
            productId: productImages.productId,
            url: productImages.url,
            rn: sql<number>`row_number() over (partition by ${productImages.productId} order by ${productImages.isPrimary} desc, ${productImages.sortOrder} asc, ${productImages.id} asc)`.as(
              "rn"
            ),
          })
          .from(productImages)
          .as("pi");

        const items = await db
          .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            priceAtPurchase: orderItems.priceAtPurchase,
            product: products,
            variant: productVariants,
            imageUrl: pi.url,
          })
          .from(orderItems)
          .leftJoin(
            productVariants,
            eq(orderItems.productVariantId, productVariants.id)
          )
          .leftJoin(products, eq(productVariants.productId, products.id))
          .leftJoin(pi, and(eq(pi.productId, products.id), eq(pi.rn, 1)))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
            product: item.product,
            variant: item.variant,
            imageUrl: item.imageUrl,
          })),
        };
      })
    );

    return { success: true, data: ordersWithItems, error: null };
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return { success: false, error: "Failed to fetch orders", data: null };
  }
}

export async function getUserAddresses() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Not authenticated", data: null };
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, user.id));

    return { success: true, data: userAddresses, error: null };
  } catch (error) {
    console.error("Failed to fetch user addresses:", error);
    return { success: false, error: "Failed to fetch addresses", data: null };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify order belongs to user
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order || order.userId !== user.id) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return { success: false, error: "Cannot cancel this order" };
    }

    await db
      .update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.id, orderId));

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}

export async function updateProfileImage(imageUrl: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .update(users)
      .set({ image: imageUrl })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Failed to update profile image" };
  }
}
