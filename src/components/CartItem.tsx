"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartLine } from "@/store/cart.store";

export default function CartItem({ item }: { item: CartLine }) {
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);

  const price = parseFloat(item.variant.salePrice ?? item.variant.price);
  const lineTotal = (price * item.quantity).toFixed(2);

  return (
    <div className="flex gap-6 py-6 border-b border-light-300">
      <div className="w-36 h-36 bg-light-200 flex items-center justify-center rounded">
        {item.variant.imageUrl ? (
          <Image
            src={item.variant.imageUrl}
            alt={item.variant.product.name}
            width={144}
            height={144}
            className="object-contain"
          />
        ) : null}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-body-medium">{item.variant.product.name}</p>
            <p className="text-dark-700 text-sm mt-1">Men&apos;s Shoes</p>
            <div className="flex items-center gap-6 mt-3">
              <div className="text-sm">Size 10</div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Quantity</span>
                <div className="flex items-center gap-3 bg-light-200 px-3 py-1 rounded-full">
                  <button
                    className="p-1"
                    onClick={() =>
                      // item.id may be undefined for transient client state; guard before calling
                      item.id &&
                      updateQty(item.id, Math.max(1, item.quantity - 1))
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="p-1"
                    onClick={() =>
                      item.id && updateQty(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <span className="text-body-medium">${lineTotal}</span>
            <button
              className="text-red"
              onClick={() => item.id && remove(item.id)}
              aria-label="Remove"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
