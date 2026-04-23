import type { ReactNode } from "react";

type FallbackStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function FallbackState({
  eyebrow,
  title,
  description,
  actions,
}: FallbackStateProps) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_20px_80px_rgba(11,31,58,0.08)] sm:px-10">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
      {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
    </section>
  );
}
