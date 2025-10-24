// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Nike Store",
  description: "Your favorite Nike products",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
