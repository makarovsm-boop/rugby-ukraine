import Link from "next/link";
import { FallbackState } from "@/components/fallback-state";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <FallbackState
        eyebrow="404"
        title="Сторінку не знайдено"
        description="Можливо, матеріал було переміщено, видалено або адреса введена з помилкою."
        actions={
          <>
            <Link
              href="/"
              className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              На головну
            </Link>
            <Link
              href="/search"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            >
              До пошуку
            </Link>
          </>
        }
      />
    </div>
  );
}
