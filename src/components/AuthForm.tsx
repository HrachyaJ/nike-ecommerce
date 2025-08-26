"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
  variant: "sign-in" | "sign-up";
  onSubmit?: (
    formData: FormData
  ) => Promise<{ ok: boolean; userId?: string } | void>;
};

export default function AuthForm({ variant, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      if (!onSubmit) return;
      const result = await onSubmit(formData);

      if (result?.ok) router.push("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
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
            className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
            autoComplete="name"
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
          className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-caption text-dark-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="minimum 8 characters"
            className="w-full rounded-md border border-light-300 bg-light-100 px-4 py-3 pr-10 outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
            autoComplete={
              variant === "sign-in" ? "current-password" : "new-password"
            }
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-3 my-auto text-dark-700 text-footnote"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-dark-900 text-light-100 px-4 py-3 text-body-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        {variant === "sign-in" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}
