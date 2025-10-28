/**
 * Product-related TypeScript types
 * Centralized type definitions for type safety
 */

// Base types
export interface Product {
  id: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  minPrice?: number | null;
  gender?: {
    id: string;
    label: string;
    slug: string;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: string;
  salePrice?: string | null;
  inStock?: number | null;
  color?: {
    id: string;
    name: string;
    hex?: string | null;
  } | null;
  size?: {
    id: string;
    name: string;
    category: string;
  } | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Composite types
export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductDetail {
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface RecommendedProduct {
  id: string;
  title: string;
  imageUrl: string;
  price: number | null;
}

// Filter types
export interface ProductFilters {
  search?: string;
  gender?: string[];
  category?: string[];
  brand?: string[];
  color?: string[];
  size?: string[];
  price?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "bestselling"
  | "rating";

// API Response types
export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProductDetailResponse {
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
}

// UI Component types
export interface ColorVariant {
  id: string;
  color: string;
  images: string[];
  isSelected: boolean;
}

export interface SizeOption {
  size: string;
  available: boolean;
}

export interface FilterBadge {
  label: string;
  value: string;
  type: "gender" | "size" | "color" | "brand" | "category" | "price" | "search";
}

// Cart types
export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: Product;
  addedAt: Date;
}

// Stock types
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface StockInfo {
  available: boolean;
  quantity: number;
  status: StockStatus;
  message: string;
}

// Price types
export interface PriceInfo {
  regular: number;
  sale?: number;
  discount?: number;
  discountPercentage?: number;
}

// Badge types
export type BadgeType = "new" | "sale" | "limited" | "exclusive" | "bestseller";

export interface ProductBadge {
  type: BadgeType;
  label: string;
  color: string;
}

// Form types
export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface ReviewFormData {
  productId: string;
  rating: number;
  content: string;
  author: string;
}

// Search params types (for Next.js)
export type SearchParams = Record<string, string | string[] | undefined>;

export interface PageProps<T = Record<string, never>> {
  params: Promise<T>;
  searchParams?: Promise<SearchParams>;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = Promise<T>;

// Error types
export interface ProductError {
  code: string;
  message: string;
  details?: unknown;
}

// Pagination types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter state types
export interface FilterState {
  activeFilters: ProductFilters;
  availableFilters: AvailableFilters;
}

export interface AvailableFilters {
  genders: string[];
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// Analytics types
export interface ProductViewEvent {
  productId: string;
  productName: string;
  category?: string;
  price: number;
  timestamp: Date;
}

export interface AddToCartEvent extends ProductViewEvent {
  variantId: string;
  quantity: number;
}

// Validation types
export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

// Helper type guards
export function isProduct(obj: unknown): obj is Product {
  return (
    typeof obj === "object" && obj !== null && "id" in obj && "name" in obj
  );
}

export function isProductVariant(obj: unknown): obj is ProductVariant {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "productId" in obj &&
    "sku" in obj
  );
}

export function hasVariants(
  product: Product | ProductWithVariants
): product is ProductWithVariants {
  return "variants" in product && Array.isArray(product.variants);
}
