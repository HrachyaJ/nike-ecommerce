import Link from "next/link";
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
