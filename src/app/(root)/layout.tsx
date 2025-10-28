import { Footer, Hero, Navbar, PromoSection, Showcase } from "@/components";
import BottomFooter from "@/components/BottomFooter";
import { getCurrentUser } from "@/lib/auth/actions";
import type { ReactNode } from "react";

interface RootGroupLayoutProps {
  readonly children: ReactNode;
}

export default async function RootGroupLayout({
  children,
}: RootGroupLayoutProps) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <Hero />
      <main className="min-h-screen">{children}</main>
      <Showcase />
      <PromoSection />
      <Footer />
      <BottomFooter />
    </>
  );
}
