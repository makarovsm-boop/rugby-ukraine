import type { ReactNode } from "react";

type AdminFormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export const adminInputClass =
  "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]";

export const adminTextareaClass =
  "w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]";

export const adminSelectClass =
  "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]";

export const adminFileClass =
  "w-full rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mb-3 file:mr-0 file:block file:w-full file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white sm:file:mb-0 sm:file:mr-4 sm:file:inline-flex sm:file:w-auto";

export const adminPrimaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)] sm:w-fit";

export const adminDangerButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 sm:w-fit";

export const adminNeutralButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] sm:w-fit";

export function AdminFormField({
  label,
  hint,
  children,
  className = "",
}: AdminFormFieldProps) {
  return (
    <label className={`grid gap-2 ${className}`.trim()}>
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-6 text-slate-500">{hint}</span> : null}
    </label>
  );
}
