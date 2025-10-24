import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { getAllProducts } from "@/lib/actions/product";
import { parseFilterParams } from "@/lib/utils/query";

type SearchParams = Record<string, string | string[] | undefined>;

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function buildActiveBadges(params: SearchParams): string[] {
  const badges: string[] = [];

  // Gender badges
  toArray(params.gender).forEach((g) =>
    badges.push(g.charAt(0).toUpperCase() + g.slice(1))
  );

  // Size badges
  toArray(params.size).forEach((s) => badges.push(`Size: ${s}`));

  // Color badges
  toArray(params.color).forEach((c) =>
    badges.push(c.charAt(0).toUpperCase() + c.slice(1))
  );

  // Brand badges
  toArray(params.brand).forEach((b) =>
    badges.push(b.charAt(0).toUpperCase() + b.slice(1))
  );

  // Category badges
  toArray(params.category).forEach((c) =>
    badges.push(c.charAt(0).toUpperCase() + c.slice(1))
  );

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

function formatPrice(minPrice: number | null, maxPrice: number | null): string {
  if (minPrice === null && maxPrice === null) return "Price unavailable";
  if (minPrice === maxPrice) return `$${minPrice}`;
  if (minPrice === null) return `Up to $${maxPrice}`;
  if (maxPrice === null) return `From $${minPrice}`;
  return `$${minPrice} - $${maxPrice}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const sp = await searchParams;

    // Parse the search parameters using your existing utility
    const filters = parseFilterParams(sp);

    // Fetch products from database
    const { products, totalCount } = await getAllProducts(filters);

    // Build active filter badges
    const activeBadges = buildActiveBadges(sp);

    // Add search badge if present
    if (filters.search) {
      activeBadges.unshift(`Search: "${filters.search}"`);
    }

    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-heading-3 text-dark-900">
            Products ({totalCount})
          </h1>
          <Sort />
        </header>

        {activeBadges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeBadges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className="rounded-full border border-light-300 px-3 py-1 text-caption text-dark-900"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          {/* Sticky/Floating Filters Sidebar */}
          <div className="md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <Filters />
          </div>

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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    title={product.name}
                    description={product.subtitle || ""}
                    imageSrc={product.imageUrl || "/placeholder-shoe.jpg"}
                    price={product.minPrice || 0}
                    imageAlt={`${product.name} shoe`}
                    href={`/products/${product.id}`}
                  />
                ))}
              </div>
            )}

            {/* Pagination info - you might want to add actual pagination controls */}
            {totalCount > products.length && (
              <div className="mt-6 text-center">
                <p className="text-caption text-dark-500">
                  Showing {products.length} of {totalCount} products
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading products page:", error);
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
          <p className="text-body text-red-700">
            Sorry, there was an error loading the products. Please try again
            later.
          </p>
        </div>
      </main>
    );
  }
}
