"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";

export default function AddToCartButton({ variantId, disabled = false }: { variantId?: string | null; disabled?: boolean }) {
  const add = useCartStore((s) => s.add);
  const [loading, setLoading] = useState(false);

  const canAdd = !!variantId && !disabled && !loading;

  async function onAdd() {
    if (!variantId) return;
    try {
      setLoading(true);
      await add(variantId, 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onAdd}
      disabled={!canAdd}
      className="w-full bg-black text-white py-3 sm:py-4 px-6 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
    >
      <ShoppingBag className="w-5 h-5" />
      {loading ? "Adding..." : "Add to Bag"}
    </button>
  );
}


