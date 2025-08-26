import { Footer, Hero, Navbar, PromoSection, Showcase } from "@/components";

export default function RootGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <Hero />
      {children}
      <Showcase />
      <PromoSection />
      <Footer />
    </>
  );
}
