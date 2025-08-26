import Image from "next/image";
import Link from "next/link";

export interface CardProps {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  imageSrc: string;
  imageAlt: string;
  price?: number;
  badge?: string;
  badgeColor?: "orange" | "green" | "red" | "blue";
  colorOptions?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  id,
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  price,
  badge,
  badgeColor = "orange",
  colorOptions,
  href,
  onClick,
  className = "",
}: CardProps) {
  const badgeColorClasses = {
    orange: "bg-orange-500 text-orange-500",
    green: "bg-green-500 text-green-500",
    red: "bg-red-500 text-red-500",
    blue: "bg-blue-500 text-blue-500",
  };

  const CardContent = (
    <div
      className={` overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-[16px] py-0.5 px-3">
          <span
            className={`inline-block px-0 py-0 text-sm font-medium ${badgeColorClasses[badgeColor]} bg-transparent`}
          >
            {badge}
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
      <div className="p-6">
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

        {/* Category */}
        {category && <p className="text-gray-500 text-base mb-1">{category}</p>}

        {/* Color Options */}
        {colorOptions && (
          <p className="text-gray-500 text-base">{colorOptions}</p>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-700 text-sm mt-3 line-clamp-2">
            {description}
          </p>
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
