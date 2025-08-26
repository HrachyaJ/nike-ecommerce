import Image from 'next/image';
import Link from 'next/link';

export default function PromoSection() {
  return (
    <section className="relative bg-white overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Diagonal Orange Background - Narrow stripe like Figma */}
      <div
        className="absolute inset-0 bg-orange-200 transform-gpu"
        style={{
          clipPath: 'polygon(75% 0%, 95% 0%, 65% 100%, 45% 100%)'
        }}
        aria-hidden="true"
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Section - Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="inline-block text-pink-500 text-sm font-semibold uppercase tracking-wider">
              Bold & Sporty
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              NIKE REACT
              <br />
              PRESTO BY YOU
            </h1>
            <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
              Take advantage of brand new, proprietary cushioning technology with a fresh pair of Nike react shoes.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* Right Section - Sneaker Image */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            <Image
              src="/sneaker-image.png"
              alt="Nike React Presto Shoes"
              width={700}
              height={450}
              priority
              className="object-contain w-full max-w-lg lg:max-w-none transform rotate-[-10deg] scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}