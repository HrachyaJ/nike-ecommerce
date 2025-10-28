import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Heart, ChevronRight } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";
import AddToCartButton from "@/components/AddToCartButton";
import {
  getProduct,
  getProductReviews,
  getRecommendedProducts,
} from "@/lib/actions/product";
import {
  getColorHex,
  sortSizes,
  calculateAverageRating,
  hasActiveSale,
  getLowestPrice,
  pluralize,
} from "@/lib/utils";
import {
  DEFAULT_RATING,
  RECOMMENDED_PRODUCTS_LIMIT,
  REVIEWS_PREVIEW_LIMIT,
} from "@/lib/constants/product";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productData = await getProduct(resolvedParams.id);

  if (!productData) {
    return {
      title: "Product Not Found | Nike Store",
    };
  }

  const { product, images } = productData;

  return {
    title: `${product.name} | Nike Store`,
    description: product.description || `Shop ${product.name} at Nike Store.`,
    openGraph: {
      title: product.name,
      description: product.description || product.name || "",
      images: images[0]?.url ? [images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productData = await getProduct(resolvedParams.id);

  if (!productData) {
    notFound();
  }

  const { product, variants, images } = productData;

  // Fetch reviews and recommendations in parallel
  const [reviews, recommendedProducts] = await Promise.all([
    getProductReviews(resolvedParams.id),
    getRecommendedProducts(resolvedParams.id),
  ]);

  // Group variants by color
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

  // Prepare color variants with images
  const colorVariants = Array.from(variantsByColor.entries()).map(
    ([colorId, colorVariants], index) => {
      const firstVariant = colorVariants[0];

      const variantImages = images
        .filter(
          (img) =>
            img.variantId && colorVariants.some((v) => v.id === img.variantId)
        )
        .sort((a, b) => {
          if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
          return a.sortOrder - b.sortOrder;
        })
        .map((img) => img.url);

      const productImages = images
        .filter((img) => !img.variantId)
        .sort((a, b) => {
          if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
          return a.sortOrder - b.sortOrder;
        })
        .map((img) => img.url);

      return {
        id: colorId,
        color: firstVariant.color?.name || "Unknown",
        images: variantImages.length > 0 ? variantImages : productImages,
        isSelected: index === 0,
      };
    }
  );

  // Get all unique sizes
  const allSizes = sortSizes(
    Array.from(
      new Set(variants.map((v) => v.size?.name).filter(Boolean) as string[])
    )
  ).map((size: string) => ({
    size,
    available: variants.some(
      (v) => v.size?.name === size && (v.inStock ?? 0) > 0
    ),
  }));

  // Calculate pricing
  const averageRating = calculateAverageRating(reviews, DEFAULT_RATING);
  const hasSale = hasActiveSale(variants);
  const displayPrice = getLowestPrice(variants, false);
  const salePrice = hasSale ? getLowestPrice(variants, true) : null;
  const selectedVariant = colorVariants[0];

  return (
    <div className="min-h-screen bg-white">
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
                <li aria-hidden="true">
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
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium truncate max-w-[60%] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Gallery */}
          <div className="order-1">
            <ProductGallery
              variants={colorVariants}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* Product Info */}
          <div className="order-2 space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {product.gender?.label} {product.category?.name}
              </p>
            </div>

            {/* Price */}
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
              <div
                className="flex items-center"
                aria-label={`Rating: ${averageRating.toFixed(
                  1
                )} out of 5 stars`}
              >
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
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {pluralize(reviews.length, "Review")}
              </span>
            </div>

            {/* Colors */}
            {colorVariants.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Color</h3>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Select color"
                >
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      role="radio"
                      aria-checked={variant.isSelected}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        variant.isSelected
                          ? "border-gray-900 ring-2 ring-gray-300"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: getColorHex(variant.color) }}
                      aria-label={`Select ${variant.color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {allSizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select Size
                  </h3>
                  <div className="relative group">
                    <button
                      className="text-sm text-gray-600 underline hover:text-gray-900"
                      aria-label="View size guide"
                    >
                      Size Guide
                    </button>
                    <div
                      className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
                      role="tooltip"
                    >
                      <p className="mb-2 font-medium">Size Conversion Chart:</p>
                      <ul className="space-y-1">
                        <li>US 7: EU 40, UK 6, 25cm</li>
                        <li>US 8: EU 41, UK 7, 26cm</li>
                        <li>US 9: EU 42.5, UK 8, 27cm</li>
                        <li>US 10: EU 44, UK 9, 28cm</li>
                        <li>US 11: EU 45, UK 10, 29cm</li>
                      </ul>
                      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-gray-900 transform rotate-45" />
                    </div>
                  </div>
                </div>
                <SizePicker sizes={allSizes} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <AddToCartButton variantId={variants[0]?.id ?? null} />
              <button
                className="w-full border border-gray-300 text-gray-900 py-3 sm:py-4 px-6 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                aria-label="Add to favorites"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
                Favorite
              </button>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection title="Product Details" defaultOpen>
                <div className="space-y-4">
                  {product.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.brand && (
                    <p className="text-sm text-gray-600">
                      <strong>Brand:</strong> {product.brand.name}
                    </p>
                  )}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-3 text-gray-700 text-sm">
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

              <CollapsibleSection title={`Reviews (${reviews.length})`}>
                <div className="text-center py-4">
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="flex items-center gap-2">
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
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-gray-900 font-medium text-lg">
                          {averageRating.toFixed(1)} out of 5
                        </p>
                        <p className="text-gray-500 text-sm">
                          Based on {pluralize(reviews.length, "review")}
                        </p>
                      </div>

                      <div className="mt-6 space-y-4 text-left">
                        {reviews
                          .slice(0, REVIEWS_PREVIEW_LIMIT)
                          .map((review) => (
                            <article
                              key={review.id}
                              className="border-b border-gray-200 pb-4 last:border-0"
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
                                      aria-hidden="true"
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
                            </article>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-gray-300"
                            aria-hidden="true"
                          />
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

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="bg-gray-50 py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recommendedProducts
                .slice(0, RECOMMENDED_PRODUCTS_LIMIT)
                .map((relatedProduct) => (
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
        </section>
      )}
    </div>
  );
}
