import { Navbar } from "@/components";
import BottomFooter from "@/components/BottomFooter";
import { getCurrentUser } from "@/lib/auth/actions";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Nike Store",
  description:
    "Browse our collection of Nike shoes and sneakers. Filter by size, color, brand, and more.",
};

interface ProductsLayoutProps {
  readonly children: ReactNode;
}

export default async function ProductsLayout({
  children,
}: ProductsLayoutProps) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">{children}</main>
      <BottomFooter />
    </>
  );
}
