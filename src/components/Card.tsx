import Image from "next/image";
import Link from "next/link";
import { BADGE_TYPES } from "@/lib/constants";

export type BadgeType = keyof typeof BADGE_TYPES;

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  imageSrc: string;
  imageAlt: string;
  price?: number;
  badge?: BadgeType;
  colorOptions?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  price,
  badge,
  colorOptions,
  href,
  onClick,
  className = "",
}: CardProps) {
  const CardContent = (
    <div
      className={` overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Badge */}
      {badge && BADGE_TYPES[badge] && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-2xl py-0.5 px-3">
          <span
            className={`inline-block px-0 py-0 text-sm font-medium ${BADGE_TYPES[badge].color} bg-transparent`}
          >
            {BADGE_TYPES[badge].label}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-80 w-full bg-gray-100 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 1200px), 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-black font-medium text-base leading-tight flex-1 pr-4">
            {title}
          </h3>
          {price !== undefined && (
            <span className="text-black font-medium text-base whitespace-nowrap">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Description (Category like "Men's Shoes") - Now shown first */}
        {description && (
          <p className="text-gray-500 text-base mb-1">{description}</p>
        )}

        {/* Category (Color info like "6 Colour") - Now shown second */}
        {category && <p className="text-gray-500 text-base mb-1">{category}</p>}

        {/* Color Options */}
        {colorOptions && (
          <p className="text-gray-500 text-base">{colorOptions}</p>
        )}

        {/* Action Button */}
        {onClick && (
          <button
            onClick={onClick}
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium mt-4"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} className="block group">
        <div className="relative">{CardContent}</div>
      </Link>
    );
  }

  // If onClick is provided, wrap in button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left block group"
        aria-label={`View details for ${title}`}
      >
        <div className="relative">{CardContent}</div>
      </button>
    );
  }

  // Default return without wrapper
  return <div className="relative">{CardContent}</div>;
}
