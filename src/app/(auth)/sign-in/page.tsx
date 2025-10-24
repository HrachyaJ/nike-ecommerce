import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/lib/auth/actions";

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-heading-3 font-semibold">Welcome back</h1>
        <p className="text-dark-700 text-body">
          Sign in to continue your journey.
        </p>
      </div>

      <AuthForm variant="sign-in" onSubmit={signIn} />

      <p className="text-center text-caption text-dark-700">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline cursor-pointer">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
