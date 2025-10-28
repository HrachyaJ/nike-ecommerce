"use server";

import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  cartItems,
  productVariants,
  products,
  productImages,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";

export async function createOrder(stripeSessionId: string, userId?: string) {
  try {
    console.log("🔍 Creating order for session:", stripeSessionId);

    // Retrieve the checkout session from Stripe
    console.log("📡 Retrieving Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ["line_items"],
    });

    console.log("✅ Session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    if (!session || session.payment_status !== "paid") {
      console.log("❌ Invalid or unpaid session");
      throw new Error(
        `Invalid or unpaid session. Status: ${session?.payment_status}`
      );
    }

    // Get userId from parameter or session metadata
    const orderUserId = userId || session.metadata?.userId || null;
    console.log("👤 User ID for order:", orderUserId);

    // Check if order already exists using stripe_session_id
    console.log("🔍 Checking for existing order with stripe_session_id...");
    console.log("Stripe Session ID:", stripeSessionId);

    let existingOrderId: string | null = null;
    try {
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeSessionId, stripeSessionId))
        .limit(1);

      console.log("Query result:", result);

      if (result && result.length > 0) {
        existingOrderId = result[0].id;
        console.log(
          "✅ Order already exists for this session:",
          existingOrderId
        );
        return { success: true, orderId: existingOrderId };
      }
    } catch (error) {
      console.error("Error checking for existing order:", error);
      throw error;
    }

    // Get cart items from metadata
    const cartId = session.metadata?.cartId;
    console.log("🛒 Cart ID from metadata:", cartId);

    if (!cartId) {
      console.log("❌ Cart ID not found in session metadata");
      console.log("📋 Available metadata:", session.metadata);
      throw new Error(
        "Cart ID not found in session metadata. Make sure to include cartId when creating the checkout session."
      );
    }

    // Get cart items with details
    console.log("📦 Getting cart items...");
    const cartItemsWithDetails = await getCartItemsWithDetails(cartId);
    console.log("📦 Cart items found:", cartItemsWithDetails.length);

    if (cartItemsWithDetails.length === 0) {
      console.log("❌ No items found in cart");
      throw new Error(
        `No items found in cart ${cartId}. Cart may have been cleared or cart ID is incorrect.`
      );
    }

    // Calculate total amount
    const totalAmount = cartItemsWithDetails.reduce((sum, item) => {
      const price = parseFloat(item.finalPrice || "0");
      return sum + price * item.quantity;
    }, 0);

    const shippingCost = 2.0;
    const finalTotal = totalAmount + shippingCost;

    console.log("💰 Order totals:", { totalAmount, shippingCost, finalTotal });

    // Create order - database will generate UUID automatically
    console.log("📝 Creating order in database...");
    const newOrderData = {
      id: crypto.randomUUID(), // Generate a UUID for the order
      userId: orderUserId, // Use the userId from parameter or metadata
      status: "paid" as const,
      totalAmount: finalTotal.toString(),
      shippingAddressId: null,
      billingAddressId: null,
      stripeSessionId: stripeSessionId, // Store stripe session ID to prevent duplicates
    };

    console.log("📝 Order data to insert:", newOrderData);

    const insertedOrders = await db
      .insert(orders)
      .values(newOrderData)
      .returning();

    const newOrder = insertedOrders[0];
    console.log("✅ Order created with ID:", newOrder.id);

    // Create order items
    const orderItemsData = cartItemsWithDetails.map((item) => ({
      id: crypto.randomUUID(),
      orderId: newOrder.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceAtPurchase: item.finalPrice || "0", // Keep as string for numeric type
    }));

    console.log("📦 Creating order items:", orderItemsData.length, "items");
    await db.insert(orderItems).values(orderItemsData);

    // Clear the cart after successful order
    console.log("🧹 Clearing cart...");
    const deletedItems = await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .returning();

    console.log("🧹 Cleared", deletedItems.length, "cart items");

    console.log("🎉 Order created successfully:", newOrder.id);
    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("❌ Error creating order:", error);

    let errorMessage = "Failed to create order";
    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes("Cart ID not found")) {
        errorMessage +=
          "\n\nTip: Make sure you include cartId in metadata when creating the Stripe checkout session.";
      } else if (error.message.includes("No items found in cart")) {
        errorMessage +=
          "\n\nTip: The cart might have been cleared already, or the cart ID might be incorrect.";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getOrder(orderId: string) {
  try {
    console.log("🔍 Getting order:", orderId);

    // Try simple select first
    const simpleOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, orderId))
      .limit(1);

    if (simpleOrders.length === 0) {
      console.log("❌ Order not found with simple query");
      return { success: false, error: "Order not found" };
    }

    const basicOrder = simpleOrders[0];
    console.log("✅ Basic order found:", basicOrder);

    // Now try the complex query
    try {
      type OrderWithRelations = typeof orders.$inferSelect & {
        items: Array<{
          variant: {
            product: { id: string; [key: string]: unknown };
            productId: string;
          };
        }>;
        user: { [key: string]: unknown } | null;
        shippingAddress: { [key: string]: unknown } | null;
        billingAddress: { [key: string]: unknown } | null;
      };

      const order = (await db.query.orders.findFirst({
        where: eq(orders.stripeSessionId, orderId),
        with: {
          items: {
            with: {
              variant: {
                with: {
                  product: true,
                },
              },
            },
          },
          user: true,
          shippingAddress: true,
          billingAddress: true,
        },
      })) as OrderWithRelations;

      if (!order) {
        console.log("❌ Complex query returned null");
        return {
          success: true,
          order: {
            ...basicOrder,
            items: [],
            user: null,
            shippingAddress: null,
            billingAddress: null,
          },
        };
      }

      // Get product images for each item
      const orderWithImages = {
        ...order,
        items: await Promise.all(
          order.items.map(
            async (item: {
              variant: {
                product: { id: string; [key: string]: unknown };
                productId: string;
              };
            }) => {
              const productImage = await db.query.productImages.findFirst({
                where: and(
                  eq(productImages.productId, item.variant.product.id),
                  eq(productImages.isPrimary, true)
                ),
              });

              return {
                ...item,
                variant: {
                  ...item.variant,
                  product: {
                    ...item.variant.product,
                    imageUrl: productImage?.url || null,
                  },
                },
              };
            }
          )
        ),
      };

      console.log(
        "✅ Order retrieved successfully with",
        orderWithImages.items.length,
        "items"
      );
      return { success: true, order: orderWithImages };
    } catch (complexQueryError) {
      console.error(
        "❌ Complex query failed, using basic order:",
        complexQueryError
      );
      return {
        success: true,
        order: {
          ...basicOrder,
          items: [],
          user: null,
          shippingAddress: null,
          billingAddress: null,
        },
      };
    }
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

async function getCartItemsWithDetails(cartId: string) {
  console.log("🔍 Getting cart items for cart:", cartId);

  try {
    // First, check if cart exists and has items
    const basicCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));

    console.log("📦 Basic cart items found:", basicCartItems.length);

    if (basicCartItems.length === 0) {
      return [];
    }

    // Now try the complex query with joins
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
        id: cartItems.id,
        cartId: cartItems.cartId,
        productVariantId: cartItems.productVariantId,
        quantity: cartItems.quantity,
        variantId: productVariants.id,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        productId: products.id,
        productName: products.name,
        imageUrl: pi.url,
      })
      .from(cartItems)
      .leftJoin(
        productVariants,
        eq(cartItems.productVariantId, productVariants.id)
      )
      .leftJoin(products, eq(productVariants.productId, products.id))
      .leftJoin(pi, and(eq(pi.productId, products.id), eq(pi.rn, 1)))
      .where(eq(cartItems.cartId, cartId));

    console.log("📦 Complex cart items query result:", items.length, "items");

    const mappedItems = items.map((item) => ({
      id: item.id,
      cartId: item.cartId,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      productName: item.productName || "Unknown Product",
      price: item.price,
      salePrice: item.salePrice,
      finalPrice: item.salePrice || item.price,
      imageUrl: item.imageUrl,
    }));

    console.log("📦 Final mapped cart items:", mappedItems);
    return mappedItems;
  } catch (error) {
    console.error("❌ Error getting cart items:", error);
    throw new Error(
      `Failed to get cart items: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
