import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDateTime,
  getTeamBySlug,
  getTeams,
} from "@/lib/db";
import { FallbackState } from "@/components/fallback-state";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
} from "@/lib/match-status";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle, siteConfig } from "@/lib/seo";

type TeamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const teams = await getTeams();

  return teams.map((team) => ({
    slug: team.slug,
  }));
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    return {
      title: buildTitle("Команди"),
    };
  }

  const safeImage = await getSafeImagePath(team.image, "teams");

  return {
    title: buildTitle(team.name),
    description: team.description,
    alternates: {
      canonical: `/teams/${team.slug}`,
    },
    openGraph: {
      title: buildTitle(team.name),
      description: team.description,
      url: `${siteConfig.url}/teams/${team.slug}`,
      type: "website",
      images: [
        {
          url: safeImage,
        },
      ],
    },
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const safeImage = await getSafeImagePath(team.image, "teams");

  const matches = [
    ...team.homeMatches.map((match) => ({
      id: match.id,
      date: match.date,
      location: match.location,
      round: match.round,
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      championshipTitle: match.championship.title,
      homeTeamName: team.name,
      awayTeamName: match.awayTeam.name,
    })),
    ...team.awayMatches.map((match) => ({
      id: match.id,
      date: match.date,
      location: match.location,
      round: match.round,
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      championshipTitle: match.championship.title,
      homeTeamName: match.homeTeam.name,
      awayTeamName: team.name,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    alternateName: team.short,
    description: team.description,
    sport: "Rugby Union",
    url: `${siteConfig.url}/teams/${team.slug}`,
    logo: safeImage,
    member: team.players.slice(0, 12).map((player) => ({
      "@type": "Person",
      name: player.name,
      roleName: player.position,
    })),
    location: {
      "@type": "Place",
      name: team.stadium,
      address: {
        "@type": "PostalAddress",
        addressCountry: team.country,
      },
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link
        href="/teams"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До всіх команд
      </Link>

      <article className="content-card-strong overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/7]">
          <Image
            src={safeImage}
            alt={team.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1120px"
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              {team.country}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {team.level}
            </span>
            <span>{team.short}</span>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {team.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              {team.description}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Домашня арена: {team.stadium}
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-900">Гравців у складі</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {team.players.length}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Матчів у базі</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {matches.length}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Скорочення</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {team.short}
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Склад
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Гравці команди
            </h2>
          </div>

          {team.players.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {team.players.map((player) => (
                <article
                  key={player.id}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        #{player.number} {player.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {player.position} • {player.height} • {player.weight}
                      </p>
                    </div>
                    <Link
                      href={`/players/${player.slug}`}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                    >
                      Профіль
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {player.summary}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <FallbackState
              title="Склад поки не заповнений"
              description="Для цієї команди ще не додано гравців у базу даних."
            />
          )}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Матчі
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Найближчий календар
            </h2>
          </div>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <article
                  key={match.id}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <p className="text-sm text-slate-500">
                    {match.championshipTitle} • {match.round}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                  >
                    {getMatchStatusLabel(match.status)}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    {match.homeTeamName} vs {match.awayTeamName}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {formatDateTime(match.date)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{match.location}</p>
                  {match.homeScore !== null && match.awayScore !== null ? (
                    <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                      Рахунок: {match.homeScore}:{match.awayScore}
                    </p>
                  ) : null}
                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Перейти до матчу
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <FallbackState
              title="Матчів поки немає"
              description="Для цієї команди ще не додано календар або результати."
            />
          )}
        </section>
      </div>
    </div>
  );
}
