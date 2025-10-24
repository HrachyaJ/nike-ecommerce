"use client";

import { CheckCircle, Package, CreditCard, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  variant: {
    id: string;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  } | null;
}

interface OrderSuccessProps {
  order: Order;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-xl border border-light-300 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Order Number</h3>
              <p className="text-sm text-gray-600">
                #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Payment</h3>
              <p className="text-sm text-gray-600">Paid with Stripe</p>
              <p className="text-xs text-gray-500 mt-1">
                Total: ${parseFloat(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Status</h3>
              <p className="text-sm text-gray-600 capitalize">{order.status}</p>
              <p className="text-xs text-gray-500 mt-1">
                {order.status === "paid"
                  ? "Processing your order"
                  : "Order confirmed"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-light-300 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Order Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                {item.variant.product.imageUrl ? (
                  <Image
                    src={item.variant.product.imageUrl}
                    alt={item.variant.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.variant.product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  $
                  {(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(
                    2
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  ${parseFloat(item.priceAtPurchase).toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      {order.user && (
        <div className="bg-white rounded-xl border border-light-300 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Name</h3>
              <p className="text-gray-600">{order.user.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">{order.user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3 bg-dark-900 text-white rounded-full hover:bg-dark-800 transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

