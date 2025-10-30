"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  FILTER_CATEGORIES,
  SIZE_GUIDE,
  COLOR_CATEGORIES,
} from "@/lib/constants";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Custom toggle function that works with standard query parameters
  const onToggle = (key: string, value: string) => {
    const current = new URLSearchParams(searchParams.toString());
    const currentValues = current.getAll(key);

    if (currentValues.includes(value)) {
      // Remove the value
      current.delete(key);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => current.append(key, v));
    } else {
      // Add the value
      current.append(key, value);
    }

    // Reset page to 1 when filters change
    current.delete("page");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, { scroll: false });
  };

  const onClearAll = () => {
    const current = new URLSearchParams(searchParams.toString());

    // Remove filter parameters but keep sort and other non-filter params
    ["gender", "size", "color", "price"].forEach((key) => {
      current.delete(key);
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) => {
    const values = searchParams.getAll(key);
    return values.includes(value);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return ["gender", "size", "color", "price"].some((key) => {
      const values = searchParams.getAll(key);
      return values.length > 0;
    });
  }, [searchParams]);

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-light-300 py-4 last:border-b-0">
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      {children}
    </div>
  );

  const ClearAllButton = () => (
    <button
      onClick={onClearAll}
      disabled={!hasActiveFilters}
      className={`text-sm underline cursor-pointer mb-3 text-muted-foreground ${
        hasActiveFilters
          ? "cursor-pointer text-muted-foreground"
          : "cursor-not-allowed text-muted-foreground"
      }`}
    >
      Clear All
    </button>
  );

  const content = (
    <div className="space-y-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium mb-3">Filters</p>
        <ClearAllButton />
      </div>
      <hr className="border-light-300" />
      <Section title="Gender">
        <div className="grid grid-cols-2 gap-2">
          {FILTER_CATEGORIES.GENDER.map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-dark-900"
                checked={isChecked("gender", g)}
                onChange={() => onToggle("gender", g)}
              />
              <span className="capitalize">{g}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Size">
        <div className="grid grid-cols-4 gap-2">
          {SIZE_GUIDE.US.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-dark-900"
                checked={isChecked("size", s.toString())}
                onChange={() => onToggle("size", s.toString())}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <div className="grid grid-cols-3 gap-2">
          {COLOR_CATEGORIES.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-dark-900"
                checked={isChecked("color", c.toLowerCase())}
                onChange={() => onToggle("color", c.toLowerCase())}
              />
              <span className="capitalize">{c}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="grid grid-cols-2 gap-2">
          {FILTER_CATEGORIES.PRICE_RANGES.map((p) => (
            <label
              key={p.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-dark-900"
                checked={isChecked("price", p.value)}
                onChange={() => onToggle("price", p.value)}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <>
      {/* Fixed: Proper sticky positioning with floating effect */}
      <div className="hidden lg:block bg-white border border-light-300 rounded-lg p-4 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
        {content}
      </div>

      <button
        className="lg:hidden mb-4 text-sm underline cursor-pointer"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="filters-drawer"
      >
        Filters
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            id="filters-drawer"
            className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-5 overflow-y-auto shadow-lg"
            role="dialog"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium">Filters</h2>
              <button
                className="text-sm underline cursor-pointer"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                Close
              </button>
            </div>
            {content}
          </aside>
        </>
      )}
    </>
  );
}
