"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/actions/cart";

export type CartVariant = {
  id: string;
  price: string;
  salePrice: string | null;
  product: { id: string; name: string };
  imageUrl: string | null;
};

export type CartLine = {
  id?: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  variant: {
    id: string;
    price: string;
    salePrice: string | null;
    product: {
      id: string;
      name: string;
    };
    imageUrl: string | null;
  };
};

type CartState = {
  id: string | null;
  items: CartLine[];
  isHydrated: boolean;
  subtotal: number;
  setFromServer: (items: CartLine[], cartId: string) => void;
  hydrate: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

function toNumber(amount: string | null | undefined): number {
  if (!amount) return 0;
  const parsed = parseFloat(amount);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      id: null,
      items: [],
      isHydrated: false,
      subtotal: 0,
      setFromServer: (items, id) => {
        const subtotal = items.reduce((sum, i) => {
          const price = toNumber(i.variant.salePrice ?? i.variant.price);
          return sum + price * i.quantity;
        }, 0);
        set({ items, id, subtotal, isHydrated: true });
      },
      hydrate: async () => {
        const data = await getCart();
        const items = (data.items ?? []) as CartLine[];
        get().setFromServer(items, data.id as string);
      },
      add: async (variantId, quantity = 1) => {
        await addCartItem(variantId, quantity);
        await get().hydrate();
      },
      updateQty: async (itemId, quantity) => {
        await updateCartItem(itemId, quantity);
        await get().hydrate();
      },
      remove: async (itemId) => {
        await removeCartItem(itemId);
        await get().hydrate();
      },
      clear: async () => {
        await clearCart();
        await get().hydrate();
      },
    }),
    {
      name: "cart-store",
      partialize: (s) => ({ items: s.items, id: s.id, subtotal: s.subtotal }),
      skipHydration: true,
    }
  )
);
