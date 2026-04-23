"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { canAccessAdminPath } from "@/lib/roles";

const adminNavigation = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/articles", label: "Статті" },
  { href: "/admin/users", label: "Користувачі" },
  { href: "/admin/teams", label: "Команди" },
  { href: "/admin/players", label: "Гравці" },
  { href: "/admin/championships", label: "Чемпіонати" },
  { href: "/admin/matches", label: "Матчі" },
  { href: "/admin/comments", label: "Коментарі" },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const visibleNavigation = adminNavigation.filter((item) =>
    canAccessAdminPath(role, item.href),
  );

  return (
    <nav aria-label="Навігація адмінки">
      <ul className="flex flex-wrap gap-2">
        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "dark-pill-button inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold"
                    : "inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/35 hover:bg-white hover:text-[var(--accent)]"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
