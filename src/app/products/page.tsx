import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { getAllProducts } from "@/lib/actions/product";
import { DEFAULT_PRODUCT_IMAGE, MIN_PRICE } from "@/lib/constants";
import { parseFilterParams } from "@/lib/utils/query";
import type { Metadata } from "next";

type SearchParams = Record<string, string | string[] | undefined>;

// Generate dynamic metadata based on filters
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const filters = parseFilterParams(sp);

  const titleParts = ["Products"];
  if (filters.search) titleParts.unshift(filters.search);
  if (filters.genderSlugs?.[0]) titleParts.push(filters.genderSlugs[0]);
  if (filters.categorySlugs?.[0]) titleParts.push(filters.categorySlugs[0]);

  return {
    title: `${titleParts.join(" - ")} | Nike Store`,
    description: `Shop Nike ${titleParts.join(
      " "
    )}. Find your perfect pair from our extensive collection.`,
  };
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildActiveBadges(params: SearchParams): string[] {
  const badges: string[] = [];

  // Gender badges
  toArray(params.gender).forEach((g) => badges.push(capitalizeFirst(g)));

  // Size badges
  toArray(params.size).forEach((s) => badges.push(`Size: ${s}`));

  // Color badges
  toArray(params.color).forEach((c) => badges.push(capitalizeFirst(c)));

  // Brand badges
  toArray(params.brand).forEach((b) => badges.push(capitalizeFirst(b)));

  // Category badges
  toArray(params.category).forEach((c) => badges.push(capitalizeFirst(c)));

  // Price range badges
  toArray(params.price).forEach((p) => {
    const [min, max] = String(p).split("-");
    const label =
      min && max
        ? `$${min} - $${max}`
        : min && !max
        ? `Over $${min}`
        : max && !min
        ? `Under $${max}`
        : `$0 - $${max}`;
    badges.push(label);
  });

  // Single price min/max badges
  if (params.priceMin) {
    badges.push(`Min: $${params.priceMin}`);
  }
  if (params.priceMax) {
    badges.push(`Max: $${params.priceMax}`);
  }

  return badges;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const sp = await searchParams;
    const filters = parseFilterParams(sp);
    const { products, totalCount } = await getAllProducts(filters);
    const activeBadges = buildActiveBadges(sp);

    // Add search badge if present
    if (filters.search) {
      activeBadges.unshift(`Search: "${filters.search}"`);
    }

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-heading-3 text-dark-900">
            Products ({totalCount})
          </h1>
          <Sort />
        </header>

        {activeBadges.length > 0 && (
          <div
            className="mb-4 flex flex-wrap gap-2"
            role="list"
            aria-label="Active filters"
          >
            {activeBadges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                role="listitem"
                className="rounded-full border border-light-300 px-3 py-1 text-caption text-dark-900"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          {/* Sticky Filters Sidebar */}
          <aside
            className="md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-2rem)] md:overflow-y-auto"
            aria-label="Product filters"
          >
            <Filters />
          </aside>

          {/* Products Grid */}
          <div>
            {products.length === 0 ? (
              <div className="rounded-lg border border-light-300 p-8 text-center">
                <p className="text-body text-dark-700">
                  No products match your filters.
                </p>
                {activeBadges.length > 0 && (
                  <p className="mt-2 text-caption text-dark-500">
                    Try adjusting your filters to see more results.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8"
                  role="list"
                  aria-label="Products"
                >
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      title={product.name}
                      description={product.subtitle || ""}
                      imageSrc={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
                      price={product.minPrice || MIN_PRICE}
                      imageAlt={`${product.name} shoe`}
                      href={`/products/${product.id}`}
                    />
                  ))}
                </div>

                {/* Pagination info */}
                {totalCount > products.length && (
                  <div className="mt-6 text-center">
                    <p className="text-caption text-dark-500">
                      Showing {products.length} of {totalCount} products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading products page:", error);
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="rounded-lg border border-red-300 bg-red-50 p-8 text-center"
          role="alert"
        >
          <p className="text-body text-red-700">
            Sorry, there was an error loading the products. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }
}
