import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildStandings,
  formatDateTime,
  getChampionshipBySlug,
  getChampionshipByTitle,
  getChampionships,
} from "@/lib/db";
import { getApiRugbyStandingsResult } from "@/lib/api-rugby";
import {
  championships as championshipOverrides,
  getChampionshipCanonicalSlug,
  findChampionshipOverrideBySlug,
} from "@/lib/championship-data";
import { FallbackState } from "@/components/fallback-state";
import { TeamBadge } from "@/components/team-badge";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
} from "@/lib/match-status";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle, siteConfig } from "@/lib/seo";

type ChampionshipPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const championships = await getChampionships();
  const slugs = new Set(championships.map((championship) => championship.slug));

  for (const championship of championshipOverrides) {
    slugs.add(championship.slug);
  }

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ChampionshipPageProps): Promise<Metadata> {
  const { slug } = await params;
  const championshipOverride = findChampionshipOverrideBySlug(slug);
  const championshipBySlug = await getChampionshipBySlug(slug);
  const championshipByTitle =
    championshipOverride && !championshipBySlug
      ? await getChampionshipByTitle(championshipOverride.title)
      : null;
  const championship =
    championshipBySlug &&
    getChampionshipCanonicalSlug({
      slug: championshipBySlug.slug,
      title: championshipBySlug.title,
    }) === slug
      ? championshipBySlug
      : championshipByTitle &&
          getChampionshipCanonicalSlug({
            slug: championshipByTitle.slug,
            title: championshipByTitle.title,
          }) === slug
        ? championshipByTitle
        : null;

  if (!championship && !championshipOverride) {
    return {
      title: buildTitle("Чемпіонати"),
    };
  }

  const displayChampionship = championship
    ? championship
    : {
        id: championshipOverride!.slug,
        slug: championshipOverride!.slug,
        title: championshipOverride!.title,
        season: championshipOverride!.season,
        region: championshipOverride!.region,
        format: championshipOverride!.format,
        description: championshipOverride!.description,
        image: championshipOverride!.image,
        matches: [],
      };
  const imageValue =
    displayChampionship.slug === "european-championship" &&
    (!displayChampionship.image ||
      displayChampionship.image === "/championship-europe.svg" ||
      displayChampionship.image === "/fallback-championship.svg")
      ? championshipOverride?.image ?? displayChampionship.image
      : displayChampionship.image;

  const safeImage = await getSafeImagePath(
    imageValue,
    "championships",
  );

  return {
    title: buildTitle(displayChampionship.title),
    description: displayChampionship.description,
    alternates: {
      canonical: `/championships/${slug}`,
    },
    openGraph: {
      title: buildTitle(displayChampionship.title),
      description: displayChampionship.description,
      url: `${siteConfig.url}/championships/${slug}`,
      type: "website",
      images: [
        {
          url: safeImage,
        },
      ],
    },
  };
}

export default async function ChampionshipPage({
  params,
}: ChampionshipPageProps) {
  const { slug } = await params;
  const championshipOverride = findChampionshipOverrideBySlug(slug);
  const championshipBySlug = await getChampionshipBySlug(slug);
  const championshipByTitle =
    championshipOverride && !championshipBySlug
      ? await getChampionshipByTitle(championshipOverride.title)
      : null;
  const championship =
    championshipBySlug &&
    getChampionshipCanonicalSlug({
      slug: championshipBySlug.slug,
      title: championshipBySlug.title,
    }) === slug
      ? championshipBySlug
      : championshipByTitle &&
          getChampionshipCanonicalSlug({
            slug: championshipByTitle.slug,
            title: championshipByTitle.title,
          }) === slug
        ? championshipByTitle
        : null;

  if (!championship && !championshipOverride) {
    notFound();
  }

  const displayChampionship = championship
    ? championship
    : {
        id: championshipOverride!.slug,
        slug: championshipOverride!.slug,
        title: championshipOverride!.title,
        season: championshipOverride!.season,
        region: championshipOverride!.region,
        format: championshipOverride!.format,
        description: championshipOverride!.description,
        image: championshipOverride!.image,
        matches: [],
      };
  const imageValue =
    displayChampionship.slug === "european-championship" &&
    (!displayChampionship.image ||
      displayChampionship.image === "/championship-europe.svg" ||
      displayChampionship.image === "/fallback-championship.svg")
      ? championshipOverride?.image ?? displayChampionship.image
      : displayChampionship.image;

  const safeImage = await getSafeImagePath(
    imageValue,
    "championships",
  );

  const fallbackStandings = championship ? buildStandings(championship.matches) : [];
  const apiRugbyStandings = await getApiRugbyStandingsResult({
    slug: displayChampionship.slug,
    title: displayChampionship.title,
    season: displayChampionship.season,
  });
  const standings =
    championshipOverride?.standings.length
      ? championshipOverride.standings
      : apiRugbyStandings.rows ?? fallbackStandings;
  const championshipMatchesOverride = championshipOverride?.matches ?? [];
  const isChampionsCupPlayoffs =
    displayChampionship.slug === "investec-champions-cup" ||
    displayChampionship.slug === "champions-cup";
  const semifinalPairs = isChampionsCupPlayoffs
    ? championshipMatchesOverride.filter((match) => match.round.includes("півфінал"))
    : [];
  const playoffResults = isChampionsCupPlayoffs
    ? championshipMatchesOverride.filter((match) => !match.round.includes("півфінал"))
    : championshipMatchesOverride;
  const matchesCount =
    championshipMatchesOverride.length > 0
      ? championshipMatchesOverride.length
      : championship?.matches.length ?? 0;
  const standingsMessage =
    championshipOverride?.standings.length
      ? "Таблиця оновлена редакцією за актуальними зовнішніми даними і використовується як ручний override для цього турніру."
      : apiRugbyStandings.message;
  const formatStandingValue = (value: number | null | undefined) =>
    typeof value === "number" ? value : "—";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/championships"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До всіх чемпіонатів
      </Link>

      <article className="content-card-strong overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/7] bg-white">
          <Image
            src={safeImage}
            alt={displayChampionship.title}
            fill
            className="object-contain p-6 sm:p-8"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1120px"
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{displayChampionship.season}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              {displayChampionship.format}
            </span>
            <span>{displayChampionship.region}</span>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {displayChampionship.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              {displayChampionship.description}
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-900">Сезон</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {displayChampionship.season}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Регіон</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {displayChampionship.region}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Матчів у базі</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {matchesCount}
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              {isChampionsCupPlayoffs ? "Плей-оф" : "Таблиця"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {isChampionsCupPlayoffs
                ? "Півфінальні пари"
                : "Поточне становище команд"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {isChampionsCupPlayoffs
                ? "Замість таблиці для цього турніру показуємо актуальні півфінальні пари плей-оф за офіційною сторінкою EPCR."
                : standingsMessage}
            </p>
          </div>

          {isChampionsCupPlayoffs ? (
            semifinalPairs.length > 0 ? (
              <div className="space-y-4">
                {semifinalPairs.map((match) => (
                  <article
                    key={`${match.round}-${match.teams}`}
                    className="content-card rounded-[1.5rem] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-slate-500">{match.round}</p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Офіційний анонс EPCR
                      </span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <h3 className="text-xl font-semibold leading-tight text-slate-950">
                        {match.teams}
                      </h3>
                      <p className="text-sm text-slate-600">{match.date}</p>
                      <p className="text-sm text-slate-500">{match.location}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <FallbackState
                title="Півфінальні пари поки недоступні"
                description="Для цього етапу плей-оф ще не додано актуальні пари."
              />
            )
          ) : standings.length > 0 ? (
            <div className="content-card overflow-hidden rounded-[1.5rem]">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-4 py-4 font-medium">#</th>
                      <th className="px-4 py-4 font-medium">Команда</th>
                      <th className="px-4 py-4 font-medium">І</th>
                      <th className="px-4 py-4 font-medium">В</th>
                      <th className="px-4 py-4 font-medium">П</th>
                      <th className="px-4 py-4 font-medium">О</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team) => (
                      <tr
                        key={team.name}
                        className="border-t border-slate-100 text-sm text-slate-700"
                      >
                        <td className="px-4 py-4 font-semibold text-slate-950">
                          {team.position}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-950">
                          <TeamBadge name={team.name} logo={"logo" in team ? team.logo : undefined} />
                        </td>
                        <td className="px-4 py-4">{formatStandingValue(team.played)}</td>
                        <td className="px-4 py-4">{formatStandingValue(team.won)}</td>
                        <td className="px-4 py-4">{formatStandingValue(team.lost)}</td>
                        <td className="px-4 py-4 font-semibold text-[var(--accent)]">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <FallbackState
              title="Таблиця поки недоступна"
              description="Для цього турніру ще недостатньо завершених матчів, щоб побудувати турнірну таблицю."
            />
          )}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Матчі
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Календар і результати
            </h2>
          </div>

          {playoffResults.length > 0 ? (
            <div className="space-y-4">
              {playoffResults.map((match) => (
                <article
                  key={`${match.round}-${match.teams}`}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">{match.round}</p>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      Редакційне оновлення
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <h3 className="text-xl font-semibold leading-tight text-slate-950">
                      {match.teams}
                    </h3>
                    <p className="text-sm text-slate-600">{match.date}</p>
                    <p className="text-sm text-slate-500">{match.location}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : championship && championship.matches.length > 0 ? (
            <div className="space-y-4">
              {championship.matches.map((match) => (
                <article
                  key={match.id}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">{match.round}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                    >
                      {getMatchStatusLabel(match.status)}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <h3 className="text-xl font-semibold leading-tight text-slate-950">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </h3>
                      <p className="mt-3 text-sm text-slate-600">
                        {formatDateTime(match.date)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{match.location}</p>
                    </div>

                    <div className="rounded-[1rem] bg-slate-50 px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        Результат
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {match.homeScore !== null && match.awayScore !== null
                          ? `${match.homeScore}:${match.awayScore}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <FallbackState
              title="Матчів поки немає"
              description="Для цього турніру календар ще не доданий або ще не опублікований."
            />
          )}
        </section>
      </div>
    </div>
  );
}
