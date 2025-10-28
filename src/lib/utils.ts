import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Product utility functions
 * Centralized helpers for product-related operations
 */

// Color mapping for product swatches
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gray: "#808080",
  grey: "#808080",
  navy: "#000080",
  burgundy: "#800020",
  maroon: "#800000",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  silver: "#C0C0C0",
  gold: "#FFD700",
  khaki: "#F0E68C",
  olive: "#808000",
  teal: "#008080",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  lime: "#00FF00",
  indigo: "#4B0082",
  violet: "#EE82EE",
  coral: "#FF7F50",
  salmon: "#FA8072",
  peach: "#FFE5B4",
  mint: "#98FF98",
  lavender: "#E6E6FA",
  turquoise: "#40E0D0",
};

/**
 * Get hex color code from color name
 * @param colorName - The name of the color
 * @returns Hex color code
 */
export function getColorHex(colorName: string): string {
  if (!colorName) return "#CCCCCC";

  const lowerName = colorName.toLowerCase().trim();

  // Exact match
  if (COLOR_HEX_MAP[lowerName]) {
    return COLOR_HEX_MAP[lowerName];
  }

  // Partial match (e.g., "Light Blue" matches "blue")
  for (const [key, value] of Object.entries(COLOR_HEX_MAP)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }

  return "#CCCCCC"; // Default gray
}

// Size order for sorting
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * Sort sizes in a logical order (numeric or size labels)
 * @param sizes - Array of size strings
 * @returns Sorted array of sizes
 */
export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    // Both are numbers - sort numerically
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    // Both are in SIZE_ORDER - sort by position
    const indexA = SIZE_ORDER.indexOf(a.toUpperCase());
    const indexB = SIZE_ORDER.indexOf(b.toUpperCase());

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // One is in SIZE_ORDER, one isn't - SIZE_ORDER comes first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Alphabetically as fallback
    return a.localeCompare(b);
  });
}

/**
 * Calculate average rating from reviews
 * @param reviews - Array of review objects with rating property
 * @param defaultRating - Default rating if no reviews exist
 * @returns Average rating
 */
export function calculateAverageRating(
  reviews: Array<{ rating: number }>,
  defaultRating: number = 0
): number {
  if (reviews.length === 0) return defaultRating;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

/**
 * Format price range for display
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price string
 */
export function formatPriceRange(
  minPrice: number | null,
  maxPrice: number | null
): string {
  if (minPrice === null && maxPrice === null) {
    return "Price unavailable";
  }

  if (minPrice === maxPrice || maxPrice === null) {
    return `$${minPrice?.toFixed(2)}`;
  }

  if (minPrice === null) {
    return `Up to $${maxPrice.toFixed(2)}`;
  }

  return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
}

/**
 * Get sale percentage
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Sale percentage as integer
 */
export function getSalePercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;

  const discount = originalPrice - salePrice;
  return Math.round((discount / originalPrice) * 100);
}

/**
 * Check if product has sale
 * @param variants - Product variants with price and salePrice
 * @returns Boolean indicating if any variant is on sale
 */
export function hasActiveSale(
  variants: Array<{ price: string; salePrice?: string | null }>
): boolean {
  return variants.some(
    (v) => v.salePrice && parseFloat(v.salePrice) < parseFloat(v.price)
  );
}

/**
 * Get lowest price from variants
 * @param variants - Product variants with price
 * @param includeSale - Whether to include sale prices
 * @returns Lowest price
 */
export function getLowestPrice(
  variants: Array<{ price: string; salePrice?: string | null }>,
  includeSale: boolean = true
): number {
  if (variants.length === 0) return 0;

  const prices = variants.map((v) => {
    const regularPrice = parseFloat(v.price);

    if (includeSale && v.salePrice) {
      const salePrice = parseFloat(v.salePrice);
      return Math.min(regularPrice, salePrice);
    }

    return regularPrice;
  });

  return Math.min(...prices);
}

/**
 * Get highest price from variants
 * @param variants - Product variants with price
 * @returns Highest price
 */
export function getHighestPrice(
  variants: Array<{ price: string; salePrice?: string | null }>
): number {
  if (variants.length === 0) return 0;

  const prices = variants.map((v) => parseFloat(v.price));
  return Math.max(...prices);
}

/**
 * Format number with proper pluralization
 * @param count - Number to format
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Formatted string
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Group variants by a specific property
 * @param variants - Array of variants
 * @param groupBy - Property to group by
 * @returns Map of grouped variants
 */
export function groupVariantsBy<T extends Record<string, unknown>>(
  variants: T[],
  groupBy: keyof T
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  variants.forEach((variant) => {
    const key = String(variant[groupBy] || "unknown");

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(variant);
  });

  return grouped;
}

/**
 * Check if variant is in stock
 * @param variant - Variant object with stock information
 * @param minStock - Minimum stock level to consider "in stock" (default: 1)
 * @returns Boolean indicating stock status
 */
export function isInStock(
  variant: { inStock?: number | null; stock?: number | null },
  minStock: number = 1
): boolean {
  const stock = variant.inStock ?? variant.stock ?? 0;
  return stock >= minStock;
}

/**
 * Get stock status label
 * @param stockCount - Stock count
 * @returns Human-readable stock status
 */
export function getStockStatus(stockCount: number | null | undefined): string {
  const stock = stockCount ?? 0;

  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  if (stock <= 10) return "Limited Stock";
  return "In Stock";
}

/**
 * Extract unique values from array of objects
 * @param items - Array of objects
 * @param key - Key to extract values from
 * @returns Array of unique values
 */
export function extractUniqueValues<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): string[] {
  const values = items
    .map((item) => item[key])
    .filter((value) => value != null)
    .map((value) => String(value));

  return Array.from(new Set(values));
}
