import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { MainNav } from "@/components/main-nav";
import { TrackedSearchForm } from "@/components/tracked-search-form";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/70 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white transition-transform duration-200 group-hover:scale-105">
              UA
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-950">
                Rugby Ukraine
              </p>
              <p className="hidden text-sm text-slate-500 sm:block">
                Новини, матчі, команди, гравці
              </p>
            </div>
          </Link>

          <div className="hidden rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-[0_10px_30px_rgba(15,35,63,0.06)] md:block">
            Український інтерфейс • Production-ready MVP
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <MainNav />

          <TrackedSearchForm
            eventSource="header"
            className="surface-card flex w-full flex-col gap-2 rounded-[1.25rem] p-2 sm:max-w-md sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
            inputClassName="h-10 w-full rounded-full bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            buttonClassName="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
            placeholder="Пошук по сайту"
          />
        </div>

        <AuthControls />
      </div>
    </header>
  );
}
