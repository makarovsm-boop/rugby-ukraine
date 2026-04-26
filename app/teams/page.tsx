import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TeamBadge } from "@/components/team-badge";
import { PageIntro } from "@/components/page-intro";
import {
  formatDateTime,
  getTeamFilterOptions,
  getTeamsByFilters,
} from "@/lib/db";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Команди"),
  description: "Список команд і збірних з регбі на Rugby Ukraine.",
  alternates: {
    canonical: "/teams",
  },
};

type TeamsPageProps = {
  searchParams: Promise<{
    country?: string;
    level?: string;
  }>;
};

function buildTeamsHref(filters?: { country?: string; level?: string }) {
  const params = new URLSearchParams();

  if (filters?.country) {
    params.set("country", filters.country);
  }

  if (filters?.level) {
    params.set("level", filters.level);
  }

  const query = params.toString();

  return query ? `/teams?${query}` : "/teams";
}

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const { country, level } = await searchParams;
  const [teams, filterOptions] = await Promise.all([
    getTeamsByFilters({ country, level }),
    getTeamFilterOptions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Команди"
        description="Збірні та клуби, які формують нинішню картину сезону. Для кожної команди є окрема сторінка зі складом, найближчими матчами та базовим контекстом."
      />

      <section className="content-card rounded-[1.5rem] p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Країна:</span>
            <Link
              href={buildTeamsHref({ level })}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !country
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Усі
            </Link>
            {filterOptions.countries.map((item) => (
              <Link
                key={item}
                href={buildTeamsHref({ country: item, level })}
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  country === item
                    ? "bg-[var(--accent)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Рівень:</span>
            <Link
              href={buildTeamsHref({ country })}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !level
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Усі
            </Link>
            {filterOptions.levels.map((item) => (
              <Link
                key={item}
                href={buildTeamsHref({ country, level: item })}
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  level === item
                    ? "bg-[var(--accent)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {teams.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {await Promise.all(
            teams.map(async (team, index) => {
              const safeImage = await getSafeImagePath(team.image, "teams");
              const nextMatch = [
                ...team.homeMatches.map((match) => ({
                  date: match.date,
                  opponentName: match.awayTeam.name,
                })),
                ...team.awayMatches.map((match) => ({
                  date: match.date,
                  opponentName: match.homeTeam.name,
                })),
              ].sort((a, b) => a.date.getTime() - b.date.getTime())[0];
              const totalMatches = team.homeMatches.length + team.awayMatches.length;

              return (
                <article
                  key={team.slug}
                  className="content-card overflow-hidden rounded-[1.5rem]"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={safeImage}
                      alt={team.name}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>

                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {team.country}
                      </span>
                      <span className="text-sm text-slate-500">
                        {team.short} • {team.level}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold leading-tight text-slate-950">
                        <TeamBadge
                          name={team.name}
                          logo={team.image ?? undefined}
                          nameClassName="text-2xl font-semibold leading-tight text-slate-950"
                        />
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {team.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] bg-slate-50 p-4 text-center text-sm text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-900">{team.players.length}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                          Гравців
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{totalMatches}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                          Матчів
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{team.short}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                          Код
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Найближчий матч</p>
                      <div className="mt-2">
                        {nextMatch ? (
                          <TeamBadge
                            name={nextMatch.opponentName}
                            size="sm"
                            nameClassName="text-sm"
                          />
                        ) : (
                          "Матчів поки немає"
                        )}
                      </div>
                      <p className="mt-1 text-slate-500">
                        {nextMatch ? formatDateTime(nextMatch.date) : ""}
                      </p>
                      <p className="mt-2 text-slate-500">Арена: {team.stadium}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/teams/${team.slug}`}
                        className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                      >
                        Відкрити команду
                      </Link>
                      {team.players[0] ? (
                        <Link
                          href={`/players/${team.players[0].slug}`}
                          className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                        >
                          Гравці команди
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            }),
          )}
        </section>
      ) : (
        <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          За цими фільтрами команд поки немає.
        </section>
      )}
    </div>
  );
}
