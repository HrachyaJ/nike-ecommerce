// app/profile/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/actions";
import { getUserOrders, getUserAddresses } from "@/lib/profile/actions";
import ProfilePage from "@/components/ProfilePage";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [ordersResult, addressesResult] = await Promise.all([
    getUserOrders(),
    getUserAddresses(),
  ]);

  const orders = ordersResult.success ? ordersResult.data || [] : [];
  const addresses = addressesResult.success ? addressesResult.data || [] : [];

  return <ProfilePage user={user} orders={orders} addresses={addresses} />;
}
