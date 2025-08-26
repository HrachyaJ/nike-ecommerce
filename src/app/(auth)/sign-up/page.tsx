import Link from "next/link";
import SocialProviders from "@/components/SocialProviders";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/auth/actions";

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-heading-3 font-semibold">Join Nike Today!</h1>
        <p className="text-dark-700 text-body">
          Create your account to start your fitness journey
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-light-100 px-3 text-caption text-dark-700">
            Or sign up with
          </span>
        </div>
      </div>

      <AuthForm variant="sign-up" onSubmit={signUp} />

      <p className="text-center text-caption text-dark-700">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
