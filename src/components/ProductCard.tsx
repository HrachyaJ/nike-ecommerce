import { Product } from '@/db/schema';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          <span className="text-sm font-medium text-green-600">
            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <div className="flex space-x-2">
            {product.size && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {product.size}
              </span>
            )}
            {product.color && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {product.color}
              </span>
            )}
          </div>
        </div>
        <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
