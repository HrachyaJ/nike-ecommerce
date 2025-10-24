"use client";

import { useCartStore } from "@/store/cart.store";
import { createStripeCheckoutSession } from "@/lib/actions/checkout";
import { useState } from "react";
import { CreditCard, Loader2, Bug, TestTube, Globe, Zap } from "lucide-react";

export default function CartSummary({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const subtotal = useCartStore((s) => s.subtotal);
  const cartId = useCartStore((s) => s.id);
  const items = useCartStore((s) => s.items);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [isTestingSimple, setIsTestingSimple] = useState(false);

  const delivery = subtotal > 0 ? 2 : 0;
  const total = (subtotal + delivery).toFixed(2);

  const handleCheckout = async () => {
    if (!cartId || items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Creating checkout session for cart:", cartId);
      const result = await createStripeCheckoutSession(cartId);
      console.log("Checkout result:", result);

      if (result.success && result.url) {
        console.log("Redirecting to:", result.url);
        // Validate URL before redirecting
        try {
          new URL(result.url);
          window.location.href = result.url;
        } catch (urlError) {
          console.error("Invalid URL:", result.url);
          alert(`Invalid checkout URL: ${result.url}`);
        }
      } else {
        console.error("Checkout failed:", result.error);
        alert(
          `Checkout failed: ${
            result.error || "Failed to create checkout session"
          }`
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        `An error occurred during checkout: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="bg-white rounded-xl border border-light-300 p-6 w-full">
      <h3 className="text-heading-3 mb-4">Summary</h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Delivery & Handling</span>
          <span>${delivery.toFixed(2)}</span>
        </div>
        <div className="h-px bg-light-300" />
        <div className="flex justify-between font-medium text-body-medium">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <button
          disabled
          className="mt-6 w-full text-center bg-gray-300 text-gray-500 rounded-full py-3 cursor-not-allowed"
        >
          Cart is Empty
        </button>
      ) : (
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-dark-900 text-white rounded-full py-3 hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
