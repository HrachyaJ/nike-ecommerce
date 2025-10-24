"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setParam } from "@/lib/utils/query";

const options = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low-High" },
  { value: "price_desc", label: "Price: High-Low" },
];

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "featured";
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sortValue: string) => {
    startTransition(() => {
      try {
        // First set the sort parameter
        let newUrl = setParam(
          pathname,
          searchParams.toString(),
          "sort",
          sortValue === "featured" ? null : sortValue
        );

        // Parse the URL to work with search params
        const url = new URL(newUrl, window.location.origin);
        const newSearchParams = new URLSearchParams(url.search);

        // Reset page to 1 when sorting changes
        newSearchParams.delete("page");

        // Construct final URL
        const finalSearch = newSearchParams.toString();
        const finalUrl = finalSearch ? `${pathname}?${finalSearch}` : pathname;

        router.push(finalUrl, { scroll: false });
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating sort:", error);
        setIsOpen(false);
      }
    });
  };

  const selectedOption =
    options.find((option) => option.value === currentSort) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-light-300 bg-white px-4 py-2 text-sm font-medium text-dark-900 hover:bg-light-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={isPending}
      >
        <span>Sort by: {selectedOption.label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-light-300 bg-white shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-light-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    currentSort === option.value
                      ? "bg-light-100 text-blue-600 font-medium"
                      : "text-dark-900"
                  }`}
                  disabled={isPending}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
