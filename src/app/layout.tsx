import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  icons: { icon: "/logo.svg" },
  title: "Nike - Just Do It",
  description:
    "Discover the latest Nike footwear and apparel. From performance to style, find everything you need to push your limits.",
  keywords: [
    "Nike",
    "sneakers",
    "running",
    "basketball",
    "training",
    "athletic wear",
  ],
  authors: [{ name: "Nike E-commerce" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jost.className} antialiased bg-light-200 text-dark-900`}
      >
        {children}
      </body>
    </html>
  );
}
