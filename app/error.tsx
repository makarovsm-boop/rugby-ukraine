"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FallbackState } from "@/components/fallback-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <FallbackState
        eyebrow="Помилка"
        title="Щось пішло не так"
        description="Спробуйте перезавантажити сторінку або повернутися трохи пізніше. Якщо проблема повторюється, можна перейти на головну."
        actions={
          <>
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              Спробувати ще раз
            </button>
            <Link
              href="/"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            >
              На головну
            </Link>
          </>
        }
      />
    </div>
  );
}
