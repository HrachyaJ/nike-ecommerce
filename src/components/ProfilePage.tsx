"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut } from "@/lib/auth/actions";
import { cancelOrder } from "@/lib/profile/actions";
import { useRouter } from "next/navigation";
import { User, ProfileOrder, Address, OrderStatus } from "@/lib/types/orders";

type ProfilePageProps = {
  user: User;
  orders: ProfileOrder[];
  addresses: Address[];
};

export default function ProfilePage({
  user,
  orders,
  addresses,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<
    "orders" | "favorites" | "details" | "payment" | "address"
  >("orders");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const handleCancelOrder = async (orderId: string) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "pending":
      case "paid":
        return "text-orange-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: OrderStatus, createdAt: string) => {
    const date = new Date(createdAt);
    if (status === "delivered") {
      return `Delivered on ${formatDate(createdAt)}`;
    }
    if (status === "shipped") {
      const estimatedDate = new Date(date);
      estimatedDate.setDate(estimatedDate.getDate() + 7);
      return `Estimated arrival ${formatDate(estimatedDate.toISOString())}`;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* User Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-900 text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">{user.name || "User"}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-base font-medium transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-dark-900 text-dark-900"
                : "text-gray-500 hover:text-dark-900"
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-4 text-base font-medium transition-colors ${
              activeTab === "favorites"
                ? "border-b-2 border-dark-900 text-dark-900"
                : "text-gray-500 hover:text-dark-900"
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-4 text-base font-medium transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-dark-900 text-dark-900"
                : "text-gray-500 hover:text-dark-900"
            }`}
          >
            My Details
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`pb-4 text-base font-medium transition-colors ${
              activeTab === "payment"
                ? "border-b-2 border-dark-900 text-dark-900"
                : "text-gray-500 hover:text-dark-900"
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`pb-4 text-base font-medium transition-colors ${
              activeTab === "address"
                ? "border-b-2 border-dark-900 text-dark-900"
                : "text-gray-500 hover:text-dark-900"
            }`}
          >
            Address Book
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-6 mb-6 last:mb-0">
                    <div className="w-32 h-32 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.product?.name || "Product"}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium mb-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status, order.createdAt)}
                      </p>
                      <h3 className="text-xl font-semibold mb-1">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.product?.description || ""}
                      </p>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>Size {item.size?.name || "N/A"}</span>
                        <span>Quantity {item.quantity}</span>
                      </div>
                      {item.color && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Color:</span>
                          <div className="flex items-center gap-2">
                            {item.color.hex && (
                              <div
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color.hex }}
                              />
                            )}
                            <span className="text-sm text-gray-600">
                              {item.color.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right flex flex-col justify-between">
                      <p className="text-xl font-semibold">
                        ${parseFloat(item.priceAtPurchase).toFixed(2)}
                      </p>
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No favorites yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Start adding products to your favorites
          </p>
        </div>
      )}

      {activeTab === "details" && (
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user.name || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-900 focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>
            <button
              onClick={handleSignOut}
              className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payment methods saved</p>
          <button className="mt-4 px-6 py-3 bg-dark-900 text-white rounded-lg hover:bg-dark-700 transition-colors">
            Add Payment Method
          </button>
        </div>
      )}

      {activeTab === "address" && (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No addresses saved</p>
              <button className="mt-4 px-6 py-3 bg-dark-900 text-white rounded-lg hover:bg-dark-700 transition-colors">
                Add Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 uppercase">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-dark-900 text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-medium mb-1">{address.line1}</p>
                    {address.line2 && (
                      <p className="text-gray-600 text-sm">{address.line2}</p>
                    )}
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                  <button className="text-sm text-dark-900 hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
