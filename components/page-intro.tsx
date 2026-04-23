type PageIntroProps = {
  title: string;
  description: string;
};

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <section className="surface-card-strong relative overflow-hidden rounded-[2rem] px-5 py-8 sm:px-8 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0f766e_0%,#10233f_100%)]" />
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--accent)]/8 blur-xl sm:h-28 sm:w-28 sm:blur-2xl" />
      <h1 className="fade-up text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="fade-up mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
        {description}
      </p>
    </section>
  );
}
