import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import {
  formatDateTime,
  getChampionshipRegions,
  getChampionshipsByRegion,
} from "@/lib/db";
import { findChampionshipOverride } from "@/lib/championship-data";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Чемпіонати"),
  description: "Список чемпіонатів і турнірів з регбі на Rugby Ukraine.",
  alternates: {
    canonical: "/championships",
  },
};

type ChampionshipsPageProps = {
  searchParams: Promise<{
    region?: string;
  }>;
};

function buildChampionshipsHref(region?: string) {
  return region ? `/championships?region=${encodeURIComponent(region)}` : "/championships";
}

function getOverrideNextMatch(slug: string, title: string) {
  const championshipOverride = findChampionshipOverride({ slug, title });
  return championshipOverride?.matches.find((match) => match.teams.includes(" vs "));
}

export default async function ChampionshipsPage({ searchParams }: ChampionshipsPageProps) {
  const { region } = await searchParams;
  const [championships, regions] = await Promise.all([
    getChampionshipsByRegion(region),
    getChampionshipRegions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Чемпіонати"
        description="Добірка турнірів, за якими варто стежити: від збірних до клубного регбі. На окремих сторінках є базовий календар, результати й таблиця з редакційним поясненням контексту."
      />

      <section className="content-card rounded-[1.5rem] p-5 text-sm leading-7 text-slate-600">
        <p>
          Розділ чемпіонатів задуманий як зручна точка входу в турнір, а не як
          офіційна статистична база. Ми підсвічуємо формат, сезон і найближчий
          контекст, щоб читачу було простіше зорієнтуватися в змаганні.
        </p>
      </section>

      <section className="content-card rounded-[1.5rem] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-900">Регіон:</span>
          <Link
            href="/championships"
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !region
                ? "bg-[var(--accent)] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            }`}
          >
            Усі
          </Link>
          {regions.map((item) => (
            <Link
              key={item}
              href={buildChampionshipsHref(item)}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                region === item
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      {championships.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-3">
          {await Promise.all(championships.map(async (championship, index) => {
            const championshipOverride = findChampionshipOverride({
              slug: championship.slug,
              title: championship.title,
            });
            const displayChampionship = championshipOverride
              ? {
                  ...championship,
                  title: championshipOverride.title,
                  season: championshipOverride.season,
                  region: championshipOverride.region,
                  format: championshipOverride.format,
                  description: championshipOverride.description,
                  image: championshipOverride.image,
                }
              : championship;
            const safeImage = await getSafeImagePath(
              displayChampionship.image,
              "championships",
            );
            const nextMatch = championship.matches[0];
            const overrideNextMatch = getOverrideNextMatch(
              championship.slug,
              championship.title,
            );
            const matchesCount =
              championshipOverride?.matches.length && championshipOverride.matches.length > 0
                ? championshipOverride.matches.length
                : championship.matches.length;

            return (
            <article
              key={championship.slug}
              className="content-card overflow-hidden rounded-[1.5rem]"
            >
              <div className="relative aspect-[16/10] bg-white">
                <Image
                  src={safeImage}
                  alt={displayChampionship.title}
                  fill
                  className="object-contain p-5"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{displayChampionship.season}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    {displayChampionship.format}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold leading-tight text-slate-950">
                  {displayChampionship.title}
                </h2>

                <p className="text-sm leading-7 text-slate-600">
                  {displayChampionship.description}
                </p>

                <div className="grid grid-cols-2 gap-3 rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">{displayChampionship.region}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Регіон
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{matchesCount}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Матчів
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Наступний матч</p>
                  <p className="mt-2">
                    {overrideNextMatch
                      ? overrideNextMatch.teams
                      : nextMatch
                      ? `${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}`
                      : "Матчів поки немає"}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {overrideNextMatch
                      ? `${overrideNextMatch.round} · ${overrideNextMatch.date}`
                      : nextMatch
                      ? formatDateTime(nextMatch.date)
                      : ""}
                  </p>
                </div>

                <Link
                  href={`/championships/${championship.slug}`}
                  className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                >
                  Відкрити турнір
                </Link>
              </div>
            </article>
            );
          }))}
        </section>
      ) : (
        <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          За цим фільтром чемпіонатів поки немає.
        </section>
      )}
    </div>
  );
}
