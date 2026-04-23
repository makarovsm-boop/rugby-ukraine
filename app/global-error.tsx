"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError() {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <section className="w-full rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_20px_80px_rgba(11,31,58,0.08)] sm:px-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Критична помилка
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Не вдалося завантажити застосунок
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Спробуйте оновити сторінку. Якщо проблема не зникне, поверніться на
              головну і повторіть дію пізніше.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
              >
                На головну
              </Link>
            </div>
          </section>
        </div>
      </body>
    </html>
  );
}
