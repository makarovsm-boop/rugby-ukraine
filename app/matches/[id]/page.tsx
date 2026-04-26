import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTeamsDisplay } from "@/components/match-teams-display";
import { TeamBadge } from "@/components/team-badge";
import {
  formatDateTime,
  getPublicMatchById,
  getAllPublicMatches,
} from "@/lib/db";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
} from "@/lib/match-status";
import { buildTitle, siteConfig } from "@/lib/seo";

type MatchPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const matches = await getAllPublicMatches();

  return matches.map((match) => ({
    id: match.id,
  }));
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getPublicMatchById(id);

  if (!match) {
    return {
      title: buildTitle("Матчі"),
    };
  }

  const title = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
  const description = `${match.championship.title}, ${match.round}. ${formatDateTime(match.date)} • ${match.location}.`;

  return {
    title: buildTitle(title),
    description,
    alternates: {
      canonical: `/matches/${match.id}`,
    },
    openGraph: {
      title: buildTitle(title),
      description,
      url: `${siteConfig.url}/matches/${match.id}`,
      type: "website",
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await getPublicMatchById(id);

  if (!match) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    startDate: match.date.toISOString(),
    location: {
      "@type": "Place",
      name: match.location,
    },
    sport: "Rugby Union",
    eventStatus:
      match.status === "finished"
        ? "https://schema.org/EventCompleted"
        : match.status === "live"
          ? "https://schema.org/EventScheduled"
          : "https://schema.org/EventScheduled",
    competitor: [
      {
        "@type": "SportsTeam",
        name: match.homeTeam.name,
      },
      {
        "@type": "SportsTeam",
        name: match.awayTeam.name,
      },
    ],
    organizer: {
      "@type": "Organization",
      name: "Rugby Ukraine",
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link
        href="/matches"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До всіх матчів
      </Link>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(11,31,58,0.08)]">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            {match.championship.title}
          </span>
          <span>{match.round}</span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
          >
            {getMatchStatusLabel(match.status)}
          </span>
        </div>

        <div className="mt-6">
          <MatchTeamsDisplay
            homeName={match.homeTeam.name}
            awayName={match.awayTeam.name}
            homeLogo={match.homeTeam.image ?? undefined}
            awayLogo={match.awayTeam.image ?? undefined}
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            teamNameClassName="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          />
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm text-slate-500">Домашня команда</p>
              <div className="mt-2">
                <TeamBadge
                  name={match.homeTeam.name}
                  logo={match.homeTeam.image ?? undefined}
                  nameClassName="text-2xl font-semibold text-slate-950"
                />
              </div>
            </div>

            <div className="rounded-[1rem] bg-white px-5 py-4 text-center shadow-[0_10px_24px_rgba(11,31,58,0.06)]">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                Рахунок
              </p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {match.homeScore !== null && match.awayScore !== null
                  ? `${match.homeScore}:${match.awayScore}`
                  : "—"}
              </p>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-sm text-slate-500">Гостьова команда</p>
              <div className="mt-2 flex justify-center sm:justify-end">
                <TeamBadge
                  name={match.awayTeam.name}
                  logo={match.awayTeam.image ?? undefined}
                  nameClassName="text-2xl font-semibold text-slate-950"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Дата й час</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {formatDateTime(match.date)}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Місце</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {match.location}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Статус</p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getMatchStatusClasses(match.status)}`}
            >
              {getMatchStatusLabel(match.status)}
            </span>
          </div>

          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Рахунок</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {match.homeScore !== null && match.awayScore !== null
                ? `${match.homeScore}:${match.awayScore}`
                : "Ще не визначено"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/teams/${match.homeTeam.slug}`}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition-colors hover:border-[var(--accent)]/35"
          >
            <p className="text-sm text-slate-500">Домашня команда</p>
            <div className="mt-2">
              <TeamBadge
                name={match.homeTeam.name}
                logo={match.homeTeam.image ?? undefined}
                nameClassName="text-xl font-semibold text-slate-950"
              />
            </div>
          </Link>

          <Link
            href={`/teams/${match.awayTeam.slug}`}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition-colors hover:border-[var(--accent)]/35"
          >
            <p className="text-sm text-slate-500">Гостьова команда</p>
            <div className="mt-2">
              <TeamBadge
                name={match.awayTeam.name}
                logo={match.awayTeam.image ?? undefined}
                nameClassName="text-xl font-semibold text-slate-950"
              />
            </div>
          </Link>
        </div>
      </article>
    </div>
  );
}
