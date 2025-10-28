import { Navbar } from "@/components";
import BottomFooter from "@/components/BottomFooter";
import { getCurrentUser } from "@/lib/auth/actions";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      {children}
      <BottomFooter />
    </>
  );
}
