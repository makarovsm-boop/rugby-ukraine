type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function AdminPageHeader({
  eyebrow = "Розділ адмінки",
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)] sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </section>
  );
}
