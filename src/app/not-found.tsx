import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Nike Store",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        {/* Nike-style 404 */}
        <h1 className="mb-4 text-9xl font-bold tracking-tighter">404</h1>

        <h2 className="mb-2 text-2xl font-bold md:text-3xl">Page Not Found</h2>

        <p className="mb-8 text-gray-600 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="rounded-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-black px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Shop All Products
          </Link>
        </div>

        {/* Optional: Add popular links */}
        <div className="mt-12 text-sm text-gray-600">
          <p className="mb-3 font-medium">Popular pages:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products?gender=men"
              className="hover:text-black transition-colors"
            >
              Men
            </Link>
            <Link
              href="/products?gender=women"
              className="hover:text-black transition-colors"
            >
              Women
            </Link>
            <Link
              href="/products?gender=kids"
              className="hover:text-black transition-colors"
            >
              Kids
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
