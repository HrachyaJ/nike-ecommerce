"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type AuthFormProps = {
  variant: "sign-in" | "sign-up";
  onSubmit: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; data?: unknown }>;
};

export default function AuthForm({ variant, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result.success) {
          // Success - redirect to home
          router.push("/");
          router.refresh();
        } else {
          // Show error
          setError(result.error || "Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {variant === "sign-up" && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-caption text-dark-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-dark-900 disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="name"
              disabled={isPending}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-caption text-dark-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-dark-900 disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="email"
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-caption text-dark-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="minimum 8 characters"
              className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 pr-10 outline-none focus-visible:ring-2 focus-visible:ring-dark-900 disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete={
                variant === "sign-in" ? "current-password" : "new-password"
              }
              minLength={8}
              disabled={isPending}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto text-dark-700 text-footnote disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isPending}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-dark-900 text-light-100 px-4 py-3 text-body-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isPending
            ? variant === "sign-in"
              ? "Signing in..."
              : "Creating account..."
            : variant === "sign-in"
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
