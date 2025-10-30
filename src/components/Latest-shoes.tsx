import Link from "next/link";
import Card from "./Card";
import { ArrowRight } from "lucide-react";

import { BadgeType } from "./Card";

const sampleProducts = [
  {
    id: "48d4f7ca-f5c6-4761-949b-df46940ed9c9",
    title: "Nike Air Force 1 Mid '07",
    category: "Men's Shoes",
    colorOptions: "6 Colour",
    imageSrc: "/shoes/shoe-1.jpg",
    imageAlt: "Nike Air Force 1 Mid '07",
    price: 98.3,
    badge: "BESTSELLER" as BadgeType,
  },
  {
    id: "6de35d73-a5e8-45cc-99a7-016a538f4b1e",
    title: "Nike Air Max 97",
    category: "Men's Shoes",
    colorOptions: "4 Colour",
    imageSrc: "/shoes/shoe-2.webp",
    imageAlt: "Nike Air Max 97",
    price: 130.0,
    badge: "SALE" as BadgeType,
  },
  {
    id: "b39217a7-73d7-4d8e-8cd1-0560e20feaaf",
    title: "Air Max 95",
    category: "Men's Shoes",
    colorOptions: "8 Colour",
    imageSrc: "/shoes/shoe-3.webp",
    imageAlt: "Air Max 95",
    price: 170.0,
    badge: "NEW" as BadgeType,
  },
];

export default function LatestShoes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Products Section */}
        <section className="mb-16">
          <h2 id="latest" className="text-[24px] font-bold text-gray-900 mb-8">
            Latest Shoes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((product) => (
              <Card
                key={product.id}
                {...product}
                href={`/products/${product.id}`}
              />
            ))}
          </div>
          <div className="flex justify-start">
            <Link
              href="/products"
              className="inline-block bg-dark-900 text-white px-8 py-2 rounded-full text-lg group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 inline-block ml-2 mb-1" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
