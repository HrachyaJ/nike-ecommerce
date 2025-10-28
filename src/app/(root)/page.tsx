import { LatestShoes } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nike Store - Latest Shoes & Sneakers",
  description:
    "Shop the latest Nike shoes, sneakers, and athletic footwear. Find your perfect pair from our extensive collection.",
  openGraph: {
    title: "Nike Store - Latest Shoes & Sneakers",
    description: "Shop the latest Nike shoes, sneakers, and athletic footwear.",
    type: "website",
  },
};

export default async function Home() {
  return <LatestShoes />;
}
