import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]/70 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-200">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-base font-semibold text-white">Rugby Ukraine</p>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Акуратний MVP про регбі для української аудиторії: новини,
            чемпіонати, команди, гравці, авторизація, коментарі та базова
            адмінка статей.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 text-sm text-slate-400">
            <p>Next.js App Router • TypeScript • Tailwind CSS</p>
            <p>Prisma • NextAuth • PostgreSQL</p>
          </div>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
