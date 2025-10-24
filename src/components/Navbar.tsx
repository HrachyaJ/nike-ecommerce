"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";

type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
} | null;

type NavbarProps = {
  user: User;
};

export default function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hydrate = useCartStore((s) => s.hydrate);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Nike Logo" width={60} height={60} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/products?gender=men"
              className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Men
            </Link>
            <Link
              href="/products?gender=women"
              className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Women
            </Link>
            <Link
              href="/products?gender=kids"
              className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Kids
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-dark-900 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline">
                  {user.name || "Profile"}
                </span>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
            )}
            <Link
              href="/cart"
              className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              My Cart ({items.length})
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-900 hover:text-dark-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
          <Link
            href="/products?gender=men"
            className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Men
          </Link>
          <Link
            href="/products?gender=women"
            className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Women
          </Link>
          <Link
            href="/products?gender=kids"
            className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Kids
          </Link>
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <Link
                href="/profile"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Login
              </Link>
            )}
            <Link
              href="/cart"
              className="text-dark-900 hover:text-dark-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              My Cart ({items.length})
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
