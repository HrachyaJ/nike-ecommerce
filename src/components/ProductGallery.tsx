"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductVariant {
  id: string;
  color: string;
  images: string[];
  isSelected: boolean;
}

interface ProductGalleryProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
}

export default function ProductGallery({ variants, selectedVariant }: ProductGalleryProps) {
  const [currentVariant, setCurrentVariant] = useState(selectedVariant);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Update current variant when selectedVariant changes
  useEffect(() => {
    setCurrentVariant(selectedVariant);
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setCurrentVariant(variant);
    setCurrentImageIndex(0);
  }, []);

  const handleImageError = useCallback((imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc));
  }, []);

  const handleImageLoad = useCallback((imageSrc: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageSrc);
      return newSet;
    });
  }, []);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : currentVariant.images.length - 1
    );
  }, [currentVariant.images.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev < currentVariant.images.length - 1 ? prev + 1 : 0
    );
  }, [currentVariant.images.length]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goToPreviousImage();
        break;
      case "ArrowRight":
        event.preventDefault();
        goToNextImage();
        break;
    }
  }, [goToPreviousImage, goToNextImage]);

  // Filter out images that have errored
  const validImages = currentVariant.images.filter(img => !imageErrors.has(img));
  const currentImage = validImages[currentImageIndex];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {currentImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt={`${currentVariant.color} - Image ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-opacity duration-300"
              onError={() => handleImageError(currentImage)}
              onLoad={() => handleImageLoad(currentImage)}
              priority={currentImageIndex === 0}
            />
            
            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-900" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-900" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <ImageOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={`${currentVariant.id}-${index}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                index === currentImageIndex
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${currentVariant.color} - Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => handleImageError(image)}
                onLoad={() => handleImageLoad(image)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Color Variant Thumbnails */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Color Options</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const variantValidImages = variant.images.filter(img => !imageErrors.has(img));
            const firstValidImage = variantValidImages[0];
            
            return (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant)}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  variant.id === currentVariant.id
                    ? "border-gray-900 ring-2 ring-gray-300"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                aria-label={`Select ${variant.color} color variant`}
              >
                {firstValidImage ? (
                  <Image
                    src={firstValidImage}
                    alt={`${variant.color} variant`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => handleImageError(firstValidImage)}
                    onLoad={() => handleImageLoad(firstValidImage)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div 
        className="sr-only"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        aria-label="Image gallery navigation"
      >
        Use arrow keys to navigate between images
      </div>
    </div>
  );
}
