import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin-nav";

type AdminLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-[var(--surface)] px-6 py-8 shadow-[0_20px_80px_rgba(11,31,58,0.08)] sm:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Адмінка
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Панель керування Rugby Ukraine
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Єдиний простір для редакційної роботи: контент, матчі, команди,
                гравці, коментарі та базове адміністрування.
              </p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Робочий режим адмінки
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <AdminNav />
        </section>

        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
