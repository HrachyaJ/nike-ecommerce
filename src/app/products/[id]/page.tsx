import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Heart, ChevronRight } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";
import {
  getProduct,
  getProductReviews,
  getRecommendedProducts,
} from "@/lib/actions/product";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params before accessing its properties
  const resolvedParams = await params;
  const productData = await getProduct(resolvedParams.id);

  if (!productData) {
    notFound();
  }

  const { product, variants, images } = productData;
  const reviews = await getProductReviews(resolvedParams.id);
  const recommendedProducts = await getRecommendedProducts(resolvedParams.id);

  // Group variants by color for the gallery
  const variantsByColor = new Map<string, typeof variants>();
  variants.forEach((variant) => {
    if (variant.color) {
      const colorKey = variant.color.id;
      if (!variantsByColor.has(colorKey)) {
        variantsByColor.set(colorKey, []);
      }
      variantsByColor.get(colorKey)!.push(variant);
    }
  });

  // Get images for each color variant
  const colorVariants = Array.from(variantsByColor.entries()).map(
    ([colorId, colorVariants]) => {
      const firstVariant = colorVariants[0];
      const variantImages = images
        .filter(
          (img) =>
            img.variantId && colorVariants.some((v) => v.id === img.variantId)
        )
        .sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.sortOrder - b.sortOrder;
        })
        .map((img) => img.url);

      // If no variant-specific images, use product images
      const productImages = images
        .filter((img) => !img.variantId)
        .sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.sortOrder - b.sortOrder;
        })
        .map((img) => img.url);

      const allImages =
        variantImages.length > 0 ? variantImages : productImages;

      return {
        id: colorId,
        color: firstVariant.color?.name || "Unknown",
        images: allImages,
        isSelected: colorId === variantsByColor.keys().next().value, // Select first color by default
      };
    }
  );

  // Get all unique sizes from variants
  const allSizes = Array.from(
    new Set(variants.map((v) => v.size?.name).filter(Boolean))
  )
    .sort((a, b) => {
      // Simple size sorting - you might want to improve this
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
      const numA = parseFloat(String(a || "0"));
      const numB = parseFloat(String(b || "0"));

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      const indexA = sizeOrder.indexOf(String(a || ""));
      const indexB = sizeOrder.indexOf(String(b || ""));

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      return String(a || "").localeCompare(String(b || ""));
    })
    .map((size) => ({
      size: size || "",
      available: variants.some(
        (v) => v.size?.name === size && (v.inStock ?? 0) > 0
      ),
    }));

  // Calculate average rating from reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 4.5; // Default rating if no reviews

  // Get price range from variants
  const prices = variants.map((v) => parseFloat(v.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const displayPrice = minPrice === maxPrice ? minPrice : minPrice;

  // Check if there's a sale price
  const hasSalePrice = variants.some(
    (v) => v.salePrice && parseFloat(v.salePrice) < parseFloat(v.price)
  );
  const salePrice = hasSalePrice
    ? Math.min(
        ...variants.map((v) =>
          v.salePrice ? parseFloat(v.salePrice) : parseFloat(v.price)
        )
      )
    : null;

  const selectedVariant =
    colorVariants.find((v) => v.isSelected) || colorVariants[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
          <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
            <li>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
            </li>
            {product.gender?.label && (
              <>
                <li aria-hidden>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
                <li>
                  <Link
                    href={`/products?gender=${product.gender.slug}`}
                    className="hover:underline"
                  >
                    {product.gender.label}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium truncate max-w-[60%] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Gallery */}
          <div className="order-1 lg:order-1">
            <ProductGallery
              variants={colorVariants}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* Product Info */}
          <div className="order-2 lg:order-2 space-y-4 sm:space-y-6">
            {/* Title and Category */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {product.gender?.label} {product.category?.name}
              </p>
            </div>

            {/* Price and Discount */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ${salePrice ? salePrice.toFixed(2) : displayPrice.toFixed(2)}
                </span>
                {salePrice && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ${displayPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {salePrice && (
                <p className="text-green-600 font-medium text-sm sm:text-base">
                  Save ${(displayPrice - salePrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : i < averageRating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Reviews ({reviews.length})
              </span>
            </div>

            {/* Color Variants */}
            {colorVariants.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        variant.isSelected
                          ? "border-gray-900 ring-2 ring-gray-300"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{
                        backgroundColor: getColorFromName(variant.color),
                      }}
                      aria-label={`Select ${variant.color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            {allSizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select Size
                  </h3>
                  <div className="relative group">
                    <button className="text-sm text-gray-600 underline hover:text-gray-900 cursor-pointer">
                      Size Guide
                    </button>
                    <div className="absolute bottom-full right-1 mb-2 w-55 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <p className="mb-2">Find your perfect shoe size:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>US 7: EU 40, UK 6, 25cm</li>
                        <li>US 8: EU 41, UK 7, 26cm</li>
                        <li>US 9: EU 42.5, UK 8, 27cm</li>
                        <li>US 10: EU 44, UK 9, 28cm</li>
                        <li>US 11: EU 45, UK 10, 29cm</li>
                      </ul>
                      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                <SizePicker sizes={allSizes} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <AddToCartButton
                variantId={productData?.variants?.[0]?.id ?? null}
              />
              <button className="w-full border border-gray-300 text-gray-900 py-3 sm:py-4 px-6 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Favorite
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <CollapsibleSection title="Product Details" defaultOpen>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  {product.brand && (
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Brand:</strong> {product.brand.name}
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Free shipping</strong> on orders over $50. Standard
                    shipping takes 3-5 business days.
                  </p>
                  <p>
                    <strong>Free returns</strong> within 30 days of purchase.
                    Items must be in original condition.
                  </p>
                  <p>
                    <strong>Express shipping</strong> available for an
                    additional fee. Next-day delivery in select areas.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Reviews">
                <div className="text-center py-8">
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-current"
                                : i < averageRating
                                ? "text-yellow-400 fill-current opacity-50"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {averageRating.toFixed(1)} out of 5 stars
                      </p>
                      <p className="text-gray-500 text-sm">
                        Based on {reviews.length} reviews
                      </p>
                      <div className="mt-6 space-y-4">
                        {reviews.slice(0, 3).map((review) => (
                          <div
                            key={review.id}
                            className="text-left border-b border-gray-200 pb-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {review.author}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {review.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-2">No reviews yet</p>
                      <p className="text-gray-500 text-sm">
                        Be the first to review this product
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      {recommendedProducts.length > 0 && (
        <div className="bg-gray-50 py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recommendedProducts.slice(0, 3).map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  title={relatedProduct.title}
                  description=""
                  category=""
                  imageSrc={relatedProduct.imageUrl}
                  imageAlt={relatedProduct.title}
                  price={relatedProduct.price ?? undefined}
                  href={`/products/${relatedProduct.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to extract color from color name for swatch display
function getColorFromName(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    Black: "#000000",
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Orange: "#FFA500",
    Purple: "#800080",
    Pink: "#FFC0CB",
    Brown: "#A52A2A",
    Gray: "#808080",
    Grey: "#808080",
    Navy: "#000080",
    Burgundy: "#800020",
    Maroon: "#800000",
    Tan: "#D2B48C",
    Beige: "#F5F5DC",
    Cream: "#FFFDD0",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
  };

  // Try exact match first
  if (colorMap[colorName]) {
    return colorMap[colorName];
  }

  // Try partial match
  const lowerName = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return value;
    }
  }

  return "#CCCCCC"; // Default gray
}
