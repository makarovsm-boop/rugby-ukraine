"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthControls } from "@/components/auth-controls";
import { MainNav } from "@/components/main-nav";
import { SocialLinks } from "@/components/social-links";
import { TrackedSearchForm } from "@/components/tracked-search-form";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/70 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-[4.9rem] items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-rugby-ball-classic.svg"
                alt="Ukrainian Ruggers logo"
                width={78}
                height={42}
                className="h-10 w-auto"
                priority
              />
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-950">
                Ukrainian Ruggers
              </p>
              <p className="hidden text-sm text-slate-500 sm:block">
                Новини, матчі, команди, гравці
              </p>
            </div>
          </Link>

          <div className="hidden rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-[0_10px_30px_rgba(15,35,63,0.06)] md:block">
            Український інтерфейс • Production-ready MVP
          </div>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="dark-pill-button inline-flex h-11 w-11 items-center justify-center rounded-2xl xl:hidden"
          >
            <span className="sr-only">Відкрити меню</span>
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
            </span>
          </button>
        </div>

        <div className="hidden xl:block">
          <MainNav />
        </div>

        <div className="hidden gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <TrackedSearchForm
            eventSource="header"
            className="surface-card flex w-full items-center gap-2 rounded-full p-1.5"
            inputClassName="h-10 w-full rounded-full bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            buttonClassName="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            placeholder="Пошук по сайту"
          />

          <div className="surface-card rounded-[1.5rem] px-5 py-4">
            <SocialLinks />
          </div>
        </div>

        <div className="hidden xl:block">
          <AuthControls />
        </div>

        <div
          id="mobile-site-menu"
          className={
            isMenuOpen
              ? "surface-card-strong fade-up overflow-hidden rounded-[1.75rem] border border-slate-200 xl:hidden"
              : "hidden xl:hidden"
          }
        >
          <div className="grid gap-5 p-4 sm:p-5">
            <MainNav
              orientation="vertical"
              onNavigate={() => setIsMenuOpen(false)}
            />

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-2">
              <TrackedSearchForm
                eventSource="header"
                className="flex flex-col gap-2"
                inputClassName="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                buttonClassName="dark-pill-button inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors hover:bg-slate-800"
                placeholder="Пошук по сайту"
              />
            </div>

            <SocialLinks
              orientation="vertical"
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
            />

            <AuthControls
              variant="drawer"
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
