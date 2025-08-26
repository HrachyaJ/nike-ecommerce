import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:flex bg-dark-900 text-light-100 items-center justify-center p-12">
        <div className="max-w-md w-full">
          <Image
            src="/logo.svg"
            alt="Nike"
            width={60}
            height={60}
            className="mb-16 filter brightness-0 invert"
          />
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] leading-tight font-bold mb-4">
            Just Do It
          </h1>
          <p className="text-light-300 text-[16px] leading-6">
            Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
          </p>
        </div>
      </section>

      <section className="bg-light-100 flex items-center">
        <div className="w-full max-w-md mx-auto px-6 py-12">{children}</div>
      </section>
    </main>
  );
}


