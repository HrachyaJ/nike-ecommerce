// components/NavbarWrapper.tsx
import { getCurrentUser } from "@/lib/auth/actions";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentUser();

  return <Navbar user={user} />;
}
