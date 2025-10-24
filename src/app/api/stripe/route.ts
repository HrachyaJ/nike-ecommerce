"use server";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createOrder } from "@/lib/actions/orders";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);

        // Extract user ID from metadata if available
        const userId = session.metadata?.userId || undefined;

        // Create order in database
        const result = await createOrder(session.id, userId);

        if (!result.success) {
          console.error("Failed to create order:", result.error);
          return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
          );
        }

        console.log("Order created successfully:", result.orderId);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error("Payment failed:", {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          last_payment_error: paymentIntent.last_payment_error,
        });
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}





