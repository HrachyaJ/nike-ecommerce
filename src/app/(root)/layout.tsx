import { Footer, Hero, Navbar, PromoSection, Showcase } from "@/components";
import BottomFooter from "@/components/BottomFooter";
import { getCurrentUser } from "@/lib/auth/actions";

export default async function RootGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <Hero />
      {children}
      <Showcase />
      <PromoSection />
      <Footer />
      <BottomFooter />
    </>
  );
}
