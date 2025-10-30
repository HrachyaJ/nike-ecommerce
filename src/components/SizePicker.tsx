"use client";

import { useState, useCallback } from "react";
import { SIZE_GUIDE } from "@/lib/constants";

interface Size {
  size: string;
  available: boolean;
}

interface SizePickerProps {
  sizes: Size[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize((prev) => (prev === size ? null : size));
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, size: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSizeSelect(size);
      }
    },
    [handleSizeSelect]
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((sizeOption) => (
          <button
            key={sizeOption.size}
            onClick={() =>
              sizeOption.available && handleSizeSelect(sizeOption.size)
            }
            onKeyDown={(e) =>
              sizeOption.available && handleKeyDown(e, sizeOption.size)
            }
            disabled={!sizeOption.available}
            className={`
              relative py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
              ${
                !sizeOption.available
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : selectedSize === sizeOption.size
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
            aria-label={`Size ${sizeOption.size}${
              !sizeOption.available ? " - Not available" : ""
            }`}
            aria-pressed={selectedSize === sizeOption.size}
          >
            {sizeOption.size}
            {!sizeOption.available && (
              <span className="sr-only">Not available</span>
            )}
          </button>
        ))}
      </div>

      {/* Size Selection Feedback */}
      {selectedSize && (
        <div className="text-sm text-gray-600">
          Selected size: <span className="font-medium">{selectedSize}</span>
        </div>
      )}

      {/* Size Guide Link */}
      <div className="text-sm relative group">
        <button
          className="text-gray-600 underline hover:text-gray-900 transition-colors duration- cursor-pointer"
          aria-describedby="size-guide-tooltip"
        >
          How to measure your foot
        </button>
        <div
          id="size-guide-tooltip"
          className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
        >
          <p className="mb-2 font-medium">Size Conversion Chart:</p>
          <ul className="space-y-1 mb-3">
            {SIZE_GUIDE.US.map((us, index) => (
              <li key={us}>
                US {us}: EU {SIZE_GUIDE.EU[index]}, UK {SIZE_GUIDE.UK[index]},{" "}
                {SIZE_GUIDE.CM[index]}cm
              </li>
            ))}
          </ul>
          <p className="text-xs">
            To measure your foot, stand on paper, trace its outline, and measure
            from heel to longest toe.
          </p>
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
