/**
 * Product-related constants
 * Centralized configuration for product features
 */

// Default values
export const DEFAULT_PRODUCT_IMAGE = "/placeholder-shoe.jpg";
export const DEFAULT_RATING = 4.5;
export const LOW_STOCK_THRESHOLD = 5;
export const MIN_STOCK_THRESHOLD = 1;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const RECOMMENDED_PRODUCTS_LIMIT = 3;
export const REVIEWS_PER_PAGE = 10;
export const REVIEWS_PREVIEW_LIMIT = 3;

// Pricing
export const FREE_SHIPPING_THRESHOLD = 50;
export const MIN_PRICE = 0;
export const MAX_PRICE = 1000;

// Shipping & Returns
export const SHIPPING = {
  STANDARD: {
    name: "Standard Shipping",
    days: "3-5 business days",
    cost: 0,
    threshold: FREE_SHIPPING_THRESHOLD,
  },
  EXPRESS: {
    name: "Express Shipping",
    days: "1-2 business days",
    cost: 15,
  },
  OVERNIGHT: {
    name: "Overnight Shipping",
    days: "Next day",
    cost: 25,
  },
} as const;

export const RETURNS = {
  WINDOW_DAYS: 30,
  FREE: true,
  CONDITIONS: [
    "Items must be in original condition",
    "Tags must be attached",
    "No signs of wear",
    "Original packaging preferred",
  ],
} as const;

// Size guides (in cm)
export const SIZE_GUIDE = {
  US: [7, 8, 9, 10, 11, 12, 13],
  EU: [40, 41, 42.5, 44, 45, 46, 47.5],
  UK: [6, 7, 8, 9, 10, 11, 12],
  CM: [25, 26, 27, 28, 29, 30, 31],
} as const;

// Product filters
export const FILTER_CATEGORIES = {
  GENDER: ["Men", "Women", "Kids"],
  SIZE_LABELS: ["XS", "S", "M", "L", "XL", "XXL"],
  PRICE_RANGES: [
    { label: "Under $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $150", value: "100-150" },
    { label: "$150 - $200", value: "150-200" },
    { label: "Over $200", value: "200-" },
  ],
} as const;

// Sort options
export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "bestselling" },
  { label: "Highest Rated", value: "rating" },
] as const;

// Product status
export const PRODUCT_STATUS = {
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
  COMING_SOON: "coming_soon",
  DISCONTINUED: "discontinued",
} as const;

// Badge types
export const BADGE_TYPES = {
  NEW: { label: "New", color: "bg-blue-500" },
  SALE: { label: "Sale", color: "bg-red-500" },
  LIMITED: { label: "Limited", color: "bg-purple-500" },
  EXCLUSIVE: { label: "Exclusive", color: "bg-gold-500" },
  BESTSELLER: { label: "Bestseller", color: "bg-green-500" },
} as const;

// Image settings
export const IMAGE_CONFIG = {
  QUALITY: 85,
  FORMATS: ["webp", "jpg"],
  SIZES: {
    THUMBNAIL: { width: 300, height: 300 },
    CARD: { width: 500, height: 500 },
    DETAIL: { width: 1000, height: 1000 },
    FULL: { width: 2000, height: 2000 },
  },
} as const;

// Color swatches
export const COLOR_CATEGORIES = [
  "Black",
  "White",
  "Red",
  "Green",
  "Grey",
  "Blue",
] as const;

// Validation
export const VALIDATION = {
  PRODUCT_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  REVIEW: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
  },
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  PRODUCTS: 300, // 5 minutes
  PRODUCT_DETAIL: 600, // 10 minutes
  REVIEWS: 1800, // 30 minutes
  FILTERS: 3600, // 1 hour
} as const;

// Error messages
export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: "Product not found",
  VARIANT_NOT_FOUND: "Selected variant not available",
  OUT_OF_STOCK: "This item is currently out of stock",
  INVALID_QUANTITY: "Invalid quantity selected",
  LOAD_ERROR: "Failed to load products. Please try again.",
  ADD_TO_CART_ERROR: "Failed to add item to cart. Please try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: "Item added to cart",
  ADDED_TO_FAVORITES: "Added to favorites",
  REMOVED_FROM_FAVORITES: "Removed from favorites",
  REVIEW_SUBMITTED: "Review submitted successfully",
} as const;
