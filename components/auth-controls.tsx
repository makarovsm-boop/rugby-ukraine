"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { canAccessAdminPanel, getDefaultAdminHref } from "@/lib/roles";

export function AuthControls() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        {session?.user ? (
          <span>
            Увійшли як <span className="font-semibold">{session.user.name}</span>
          </span>
        ) : (
          <span>Гість</span>
        )}
      </div>

      {session?.user ? (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            Профіль
          </Link>
          {canAccessAdminPanel(session.user.role) ? (
            <Link
              href={getDefaultAdminHref(session.user.role)}
              className="dark-pill-button inline-flex min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
            >
              Адмінка
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            Вийти
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="dark-pill-button inline-flex min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
        >
          Увійти
        </Link>
      )}
    </div>
  );
}
