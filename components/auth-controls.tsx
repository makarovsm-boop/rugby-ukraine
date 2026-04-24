"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { canAccessAdminPanel, getDefaultAdminHref } from "@/lib/roles";

type AuthControlsProps = {
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
};

export function AuthControls({
  variant = "desktop",
  onNavigate,
}: AuthControlsProps) {
  const { data: session } = useSession();
  const isDrawer = variant === "drawer";

  return (
    <div
      className={
        isDrawer
          ? "flex flex-col gap-3 border-t border-slate-200 pt-5"
          : "flex flex-col gap-3 border-t border-slate-200 pt-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between"
      }
    >
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
        <div className={isDrawer ? "grid gap-2" : "flex flex-wrap items-center gap-3"}>
          <Link
            href="/profile"
            onClick={onNavigate}
            className={
              isDrawer
                ? "inline-flex min-h-11 items-center rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                : "inline-flex min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            }
          >
            Профіль
          </Link>
          {canAccessAdminPanel(session.user.role) ? (
            <Link
              href={getDefaultAdminHref(session.user.role)}
              onClick={onNavigate}
              className={
                isDrawer
                  ? "dark-pill-button inline-flex min-h-11 items-center rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-800"
                  : "dark-pill-button inline-flex min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
              }
            >
              Адмінка
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={
              isDrawer
                ? "inline-flex min-h-11 items-center rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                : "inline-flex min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            }
          >
            Вийти
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          onClick={onNavigate}
          className={
            isDrawer
              ? "dark-pill-button inline-flex min-h-11 items-center rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-800"
              : "dark-pill-button inline-flex min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
          }
        >
          Увійти
        </Link>
      )}
    </div>
  );
}
