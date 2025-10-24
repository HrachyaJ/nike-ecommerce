import Link from "next/link";

export default function BottomFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {currentYear} Nike, Inc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Guides
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Terms of Sale
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Terms of Use
            </Link>
            <Link
              href="/accessibility"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Nike Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
