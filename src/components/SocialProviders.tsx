"use client";

import Image from "next/image";

type SocialProvidersProps = {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
};

export default function SocialProviders({
  onGoogleClick,
  onAppleClick,
}: SocialProvidersProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogleClick}
        className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-light-300 px-4 py-3 text-body-medium hover:bg-light-200 transition-colors cursor-pointer"
        aria-label="Continue with Google"
      >
        <Image src="/google.svg" alt="Google" width={18} height={18} className="opacity-100" />
        <span className="relative">Continue with Google</span>
      </button>
      <button
        type="button"
        onClick={onAppleClick}
        className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-light-300 px-4 py-3 text-body-medium hover:bg-light-200 transition-colors cursor-pointer"
        aria-label="Continue with Apple"
      >
        <Image src="/apple.svg" alt="Apple" width={18} height={18} className="opacity-100" />
        <span className="relative">Continue with Apple</span>
      </button>
    </div>
  );
}


