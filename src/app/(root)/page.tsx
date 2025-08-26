import React from "react";
import Card from "@/components/Card";
import { getCurrentUser } from "@/lib/auth/actions";

const Home = async () => {
  const user = await getCurrentUser();
  console.log("USER:", user);

  const sampleProducts = [
    {
      id: "1",
      title: "Nike Air Force 1 Mid '07",
      category: "Men's Shoes",
      colorOptions: "6 Colour",
      imageSrc: "/shoes/shoe-1.jpg",
      imageAlt: "Nike Air Force 1 Mid '07",
      price: 98.3,
      badge: "Best Seller",
      badgeColor: "orange" as const,
    },
    {
      id: "2",
      title: "Nike Air Max 90",
      category: "Men's Shoes",
      colorOptions: "4 Colour",
      imageSrc: "/shoes/shoe-2.webp",
      imageAlt: "Nike Air Max 90",
      price: 130.0,
      badge: "New",
      badgeColor: "green" as const,
    },
    {
      id: "3",
      title: "Nike Jordan 1 Retro",
      category: "Men's Shoes",
      colorOptions: "8 Colour",
      imageSrc: "/shoes/shoe-3.webp",
      imageAlt: "Nike Jordan 1 Retro",
      price: 170.0,
      badge: "Popular",
      badgeColor: "blue" as const,
    },
  ];

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
        </section>
      </main>
    </div>
  );
};

export default Home;
