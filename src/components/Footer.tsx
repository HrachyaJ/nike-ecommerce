import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-start space-y-4">
              <Image
                src="/logo.svg"
                alt="Nike Logo"
                width={75}
                height={75}
                className="filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Featured Column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Featured</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/products/air-force-1" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Air Force 1
                </Link>
              </li>
              <li>
                <Link 
                  href="/products/huarache" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Huarache
                </Link>
              </li>
              <li>
                <Link 
                  href="/products/air-max-90" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Air Max 90
                </Link>
              </li>
              <li>
                <Link 
                  href="/products/air-max-95" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Air Max 95
                </Link>
              </li>
            </ul>
          </div>

          {/* Shoes Column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Shoes</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/shoes" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  All Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/shoes/custom" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Custom Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/shoes/jordan" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Jordan Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/shoes/running" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Running Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Clothing Column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Clothing</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/clothing" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  All Clothing
                </Link>
              </li>
              <li>
                <Link 
                  href="/clothing/modest" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Modest Wear
                </Link>
              </li>
              <li>
                <Link 
                  href="/clothing/hoodies" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Hoodies & Pullovers
                </Link>
              </li>
              <li>
                <Link 
                  href="/clothing/shirts" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Shirts & Tops
                </Link>
              </li>
            </ul>
          </div>

          {/* Kids Column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Kids'</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/kids/infant-toddler" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Infant & Toddler Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/kids/shoes" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Kids' Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/kids/jordan" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Kids' Jordan Shoes
                </Link>
              </li>
              <li>
                <Link 
                  href="/kids/basketball" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Kids' Basketball Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-start space-y-4">
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Twitter/X Icon */}
                <Link 
                  href="https://twitter.com/nike" 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent"
                  aria-label="Follow us on Twitter"
                >
                  <span className="inline-block w-[35px] h-[35px]">
                    <Image
                      src="/x.svg"
                      alt="x icon"
                      width={30}
                      height={30}
                      className="filter invert"
                    />
                  </span>
                </Link>

                {/* Facebook Icon */}
                <Link 
                  href="https://facebook.com/nike" 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent"
                  aria-label="Follow us on Facebook"
                >
                  <span className="inline-block w-[35px] h-[35px]">
                    <Image
                      src="/facebook.svg"
                      alt="facebook icon"
                      width={30}
                      height={30}
                      className="filter invert"
                    />
                  </span>
                </Link>

                {/* Instagram Icon */}
                <Link 
                  href="https://instagram.com/nike" 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent"
                  aria-label="Follow us on Instagram"
                >
                  <span className="inline-block w-[35px] h-[35px]">
                    <Image
                      src="/instagram.svg"
                      alt="instagram icon"
                      width={30}
                      height={30}
                      className="filter invert"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Nike, Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/accessibility" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
