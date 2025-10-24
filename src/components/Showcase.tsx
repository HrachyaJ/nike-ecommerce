import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Showcase() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 pt-10 pb-20">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Trending Now
      </h1>

      {/* Main Hero Section - React Presto */}
      <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px]">
        <Image
          src="/trending-1.png"
          alt="React Presto"
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 from-black/60 bg-gradient-to-r transition-colors duration-300"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center h-full p-8 md:p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              REACT PRESTO
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              With React foam for the most comfortable Presto ever.
            </p>
            <button className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm md:text-base cursor-pointer">
              <Link href="/products">
                Shop Now
              </Link>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Air Max Dia Card */}
        <div className="relative overflow-hidden h-80 group cursor-pointer">
          <Image
            src="/trending-2.png"
            alt="Summer Must-Haves: Air Max Dia"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Summer Must-Haves: Air Max Dia
            </h3>
          </div>
        </div>

        {/* Air Jordan 11 Card */}
        <div className="relative overflow-hidden h-80 group cursor-pointer">
          <Image
            src="/trending-3.png"
            alt="Air Jordan 11 Retro Low LE"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Air Jordan 11 Retro Low LE
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
