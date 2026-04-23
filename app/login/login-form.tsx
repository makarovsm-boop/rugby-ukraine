"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!result || result.error) {
      trackEvent("login_failure", {
        event_category: "auth",
      });
      setError("Не вдалося увійти. Перевірте email і пароль.");
      return;
    }

    trackEvent("login_success", {
      event_category: "auth",
    });
    window.location.href = result.url ?? "/";
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            defaultValue="admin@rugby-ukraine.local"
            required
            autoComplete="email"
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Пароль</span>
          <input
            type="password"
            name="password"
            defaultValue="rugby123"
            required
            autoComplete="current-password"
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
        </label>

        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)] disabled:opacity-60"
        >
          {isLoading ? "Вхід..." : "Увійти"}
        </button>
      </form>

      <div className="mt-6 rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        <p className="font-semibold text-slate-900">Тестові дані</p>
        <p className="mt-2">Email: admin@rugby-ukraine.local</p>
        <p>Пароль: rugby123</p>
      </div>

      <Link
        href="/"
        className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]"
      >
        Повернутися на головну
      </Link>
    </section>
  );
}
