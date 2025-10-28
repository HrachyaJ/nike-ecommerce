import { getCart } from "@/lib/actions/cart";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";

export const dynamic = "force-dynamic";

// async function CartHydrator() {
//   // Server component that hydrates client store on mount
//   const data = await getCart();
//   // @ts-expect-error RSC to Client bridge via inline script
//   return (
//     <script
//       dangerouslySetInnerHTML={{
//         __html: `
//           (function(){
//             if (typeof window === 'undefined') return;
//             const store = require('@@/store/cart.store');
//           })();
//         `,
//       }}
//     />
//   );
// }

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-47">
      <h1 className="text-heading-3 mb-6">Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {cart.items.length === 0 ? (
            <p className="text-dark-700">Your cart is empty.</p>
          ) : (
            cart.items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
