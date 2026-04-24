"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/seo";

type SocialLinksProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

const socialItems = [
  {
    key: "facebook",
    label: "Facebook",
    shortLabel: "Fb",
    href: siteConfig.socialLinks.facebook,
  },
  {
    key: "instagram",
    label: "Instagram",
    shortLabel: "Ig",
    href: siteConfig.socialLinks.instagram,
  },
  {
    key: "discord",
    label: "Discord",
    shortLabel: "Ds",
    href: siteConfig.socialLinks.discord,
  },
] as const;

export function SocialLinks({
  orientation = "horizontal",
  className = "",
}: SocialLinksProps) {
  const isVertical = orientation === "vertical";
  const visibleItems = socialItems.filter((item) => item.href);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Ми в соцмережах
      </p>
      <div className={isVertical ? "mt-3 grid gap-2" : "mt-3 flex flex-wrap gap-2"}>
        {visibleItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={
              isVertical
                ? "inline-flex min-h-11 items-center justify-between rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--accent)]"
                : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--accent)]"
            }
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              {item.shortLabel}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
