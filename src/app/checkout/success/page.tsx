import { Suspense } from "react";
import { getOrder, createOrder } from "@/lib/actions/orders";
import OrderSuccess from "@/components/OrderSuccess";
import { redirect } from "next/navigation";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

async function SuccessContent({ sessionId }: { sessionId: string }) {
  console.log("🚀 Success page loaded with session ID:", sessionId);

  // First, try to create the order (this handles idempotency)
  console.log("📝 Attempting to create order...");
  const createResult = await createOrder(sessionId);

  console.log("📝 Create order result:", createResult);

  if (!createResult.success) {
    console.error("❌ Order creation failed:", createResult.error);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order Creation Failed
          </h1>
          <p className="text-gray-600 mb-6">
            <strong>Debug Info:</strong>
            <br />
            Session ID: {sessionId}
            <br />
            Error: {createResult.error}
          </p>
          <div className="bg-gray-100 p-4 rounded mb-6 text-left">
            <h3 className="font-bold mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Check if the Stripe session is valid and paid</li>
              <li>Verify cartId is in the Stripe session metadata</li>
              <li>Check if cart items exist in the database</li>
              <li>Check server logs for detailed error information</li>
            </ol>
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-dark-900 text-white rounded-full hover:bg-dark-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Now get the order details
  console.log("📋 Attempting to get order...");
  const result = await getOrder(sessionId);

  console.log("📋 Get order result:", result);

  if (!result.success) {
    console.error("❌ Order retrieval failed:", result.error);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order Retrieval Failed
          </h1>
          <p className="text-gray-600 mb-6">
            <strong>Debug Info:</strong>
            <br />
            Session ID: {sessionId}
            <br />
            Order Created: {createResult.success ? "✅ Yes" : "❌ No"}
            <br />
            Error: {result.error}
          </p>
          <div className="bg-gray-100 p-4 rounded mb-6 text-left">
            <h3 className="font-bold mb-2">What happened:</h3>
            <p className="text-sm mb-2">
              The order was successfully created but could not be retrieved.
              This might be a database query issue or a timing problem.
            </p>
            <p className="text-sm">
              Check your server logs for more details about the database query.
            </p>
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-dark-900 text-white rounded-full hover:bg-dark-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  console.log("🎉 Success! Rendering order success page");
  return <OrderSuccess order={result.order} />;
}

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Processing Your Order...
        </h1>
        <p className="text-gray-600">
          Please wait while we create and retrieve your order details.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  console.log("🔗 Success page params:", { sessionId });

  if (!sessionId) {
    console.log("❌ No session ID provided, redirecting to cart");
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <SuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  );
}
