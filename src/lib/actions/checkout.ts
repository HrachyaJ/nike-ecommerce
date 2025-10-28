"use server";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import {
  cartItems,
  productVariants,
  products,
  productImages,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { mergeGuestCartWithUserCart } from "@/lib/utils/mergeSessions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function createStripeCheckoutSession(cartId: string) {
  try {
    console.log("Starting checkout session creation for cart:", cartId);

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured");
    }

    // First merge guest cart with user cart if needed
    console.log("Merging guest cart with user cart...");
    const mergedCart = await mergeGuestCartWithUserCart();
    const finalCartId = mergedCart?.cartId || cartId;
    console.log("Final cart ID:", finalCartId);

    // Get cart items with product details
    console.log("Fetching cart items...");
    const cartItemsWithDetails = await getCartItemsWithDetails(finalCartId);
    console.log("Cart items found:", cartItemsWithDetails.length);

    if (cartItemsWithDetails.length === 0) {
      throw new Error("Cart is empty");
    }

    // Get current user for metadata
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    console.log("User ID:", userId);

    // Create line items for Stripe
    console.log("Creating line items from cart data...");
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cartItemsWithDetails.map((item, index) => {
        console.log(`Processing item ${index + 1}:`, {
          id: item.id,
          productName: item.productName,
          price: item.price,
          salePrice: item.salePrice,
          finalPrice: item.finalPrice,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        });

        const unitAmount = Math.round(parseFloat(item.finalPrice || "0") * 100);
        console.log(`Item ${index + 1} - Unit Amount: ${unitAmount}`);

        // Validate each field
        if (!item.productName || item.productName.trim() === "") {
          throw new Error(
            `Item ${index + 1}: Product name is empty or invalid`
          );
        }

        if (unitAmount <= 0) {
          throw new Error(
            `Item ${index + 1}: Invalid price - ${
              item.finalPrice
            } (unit amount: ${unitAmount})`
          );
        }

        if (item.quantity <= 0) {
          throw new Error(
            `Item ${index + 1}: Invalid quantity - ${item.quantity}`
          );
        }

        // Build images array only if we have a valid URL
        const images: string[] = [];
        if (item.imageUrl && item.imageUrl.trim() !== "") {
          try {
            new URL(item.imageUrl);
            images.push(item.imageUrl);
          } catch {
            console.warn(
              `Item ${index + 1}: Invalid image URL - ${item.imageUrl}`
            );
            // Continue without image
          }
        }

        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName.trim(),
              images: images,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };

        console.log(`Item ${index + 1} line item created:`, lineItem);
        return lineItem;
      });

    // Add delivery fee as a separate line item
    const deliveryLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Fee",
          description: "Standard Delivery",
        },
        unit_amount: 200, // $2.00 in cents
      },
      quantity: 1,
    };

    lineItems.push(deliveryLineItem);

    console.log("All line items created (including delivery):", lineItems);

    // Calculate total amount
    const totalAmount = cartItemsWithDetails.reduce((sum, item) => {
      return sum + parseFloat(item.finalPrice || "0") * item.quantity;
    }, 0);

    // Add shipping cost
    const shippingCost = 2.0;
    const finalTotal = totalAmount + shippingCost;
    console.log("Total amount:", finalTotal);

    // Get base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    console.log("Environment check:", {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      baseUrl: baseUrl,
    });

    if (!baseUrl) {
      // Fallback for development
      baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://yourdomain.com"
          : "http://localhost:3000";
      console.log("Using fallback base URL:", baseUrl);
    }

    // Validate the base URL format
    try {
      new URL(baseUrl);
      console.log("Base URL is valid:", baseUrl);
    } catch {
      console.error("Invalid base URL format:", baseUrl);
      throw new Error(
        `Invalid base URL format: ${baseUrl}. Must be a valid URL starting with http:// or https://`
      );
    }

    console.log("Using base URL:", baseUrl);

    // Create Stripe checkout session with proper typing
    console.log("Creating Stripe checkout session...");

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        cartId: finalCartId,
        userId: userId || "",
        totalAmount: finalTotal.toString(),
      },
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
        ],
      },
      customer_email: session?.user?.email || undefined,
    };

    console.log(
      "Stripe session parameters:",
      JSON.stringify(sessionParams, null, 2)
    );

    const checkoutSession = await stripe.checkout.sessions.create(
      sessionParams
    );

    if (!checkoutSession || !checkoutSession.id) {
      throw new Error("Stripe checkout session was not created successfully.");
    }

    console.log("Checkout session created:", checkoutSession.id);
    console.log("Checkout session URL:", checkoutSession.url);
    console.log("Checkout session URL type:", typeof checkoutSession.url);
    console.log("Checkout session URL length:", checkoutSession.url?.length);

    if (!checkoutSession.url) {
      throw new Error("Failed to create checkout session - no URL returned");
    }

    // Validate URL format
    try {
      new URL(checkoutSession.url);
      console.log("Checkout URL is valid:", checkoutSession.url);
    } catch {
      console.error("Invalid URL format:", checkoutSession.url);
      throw new Error(`Invalid URL format: ${checkoutSession.url}`);
    }

    return { success: true, url: checkoutSession.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create checkout session",
    };
  }
}

async function getCartItemsWithDetails(cartId: string) {
  // Subquery to pick exactly one image per product (primary > sortOrder)
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

  return items.map((item) => ({
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
}
