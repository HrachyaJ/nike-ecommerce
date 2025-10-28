/**
 * Order-related TypeScript types
 * Centralized type definitions for orders, addresses, and related entities
 */

// Address types
export interface Address {
  id: string;
  userId: string;
  type: "billing" | "shipping";
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// Order status
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

// Order item - combines product and variant info for display
export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  // Product info (simplified for order display)
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
  } | null;
  // Variant info
  variant: {
    id: string;
    sku: string;
    price: string;
    salePrice: string | null;
  } | null;
  // Additional display fields
  size: {
    name: string;
    value: string | null;
  } | null;
  color: {
    name: string;
    hex: string | null;
  } | null;
  imageUrl: string | null;
}

// Full order with all details
export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string; // ISO string for serialization across client/server
  items: OrderItem[];
  user?: {
    name: string | null;
    email: string;
  } | null;
  shippingAddress?: Address | null;
}

// Database order (with Date objects) - use this in server actions
export interface OrderDB extends Omit<Order, "createdAt"> {
  createdAt: Date;
}

// Order creation payload
export interface CreateOrderPayload {
  sessionId: string;
  cartId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: string;
  shippingAddress?: Address;
}

// Order query result (from database)
export interface OrderQueryResult {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: Date;
  stripeSessionId: string | null;
  userId: string;
  items: Array<{
    id: string;
    orderId: string;
    variantId: string;
    quantity: number;
    priceAtPurchase: string;
    createdAt: Date;
    variant: {
      id: string;
      sku: string;
      price: string;
      salePrice: string | null;
      product: {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
      };
      color: {
        id: string;
        name: string;
        hex: string | null;
      } | null;
      size: {
        id: string;
        name: string;
        value: string | null;
      } | null;
    };
  }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

// Helper to transform DB order to serializable order
export function serializeOrder(dbOrder: OrderQueryResult): Order {
  return {
    id: dbOrder.id,
    status: dbOrder.status,
    totalAmount: dbOrder.totalAmount,
    createdAt: dbOrder.createdAt.toISOString(),
    items: dbOrder.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        description: item.variant.product.description,
        imageUrl: item.variant.product.imageUrl,
      },
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
        price: item.variant.price,
        salePrice: item.variant.salePrice,
      },
      size: item.variant.size,
      color: item.variant.color,
      imageUrl: item.variant.product.imageUrl,
    })),
    user: dbOrder.user
      ? {
          name: dbOrder.user.name,
          email: dbOrder.user.email,
        }
      : null,
  };
}

// User type for profile
export interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  emailVerified?: boolean | Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Profile page specific order (includes shipping address)
export interface ProfileOrder extends Order {
  shippingAddress: Address | null;
}

// Action result types
export interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface OrderResult extends ActionResult<Order> {
  order?: Order;
}
