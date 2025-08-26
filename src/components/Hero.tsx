import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Athletes running background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text and CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-pink-500 text-sm font-medium tracking-wide">
                Bold & Sporty
              </span>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight">
                Style That Moves
                <br />
                With You.
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 max-w-lg leading-relaxed">
                Not just style. Not just comfort. Footwear that effortlessly
                moves with your every step.
              </p>
            </div>
            
            <Link href="/" className='className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full text-lg"' >
              Find Your Shoe
            </Link>
          </div>

          {/* Right Section - Shoe and Branding */}
          <div className="relative">            
            {/* Main Shoe Image */}
            <div className="relative z-20 flex justify-center items-center">
              <div className="relative w-full max-w-lg h-96">
                <Image
                  src="/hero-shoe.png"
                  alt="Nike Air Jordan sneaker"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
