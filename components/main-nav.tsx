"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основна навігація" className="-mx-1 overflow-x-auto pb-1">
      <ul className="flex w-max min-w-full gap-2 px-1">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-colors"
                    : "inline-flex rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:text-[var(--accent)]"
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
