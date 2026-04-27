import type { Metadata } from "next";
import Link from "next/link";
import { MatchTeamsDisplay } from "@/components/match-teams-display";
import { PageIntro } from "@/components/page-intro";
import { formatDateTime, getPublicMatches } from "@/lib/db";
import {
  buildEditorialMatchSignature,
  getEditorialMatchCards,
} from "@/lib/editorial-matches";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
  isMatchStatus,
} from "@/lib/match-status";
import { buildTitle, siteConfig } from "@/lib/seo";

type MatchesPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const matchFilters = [
  { value: "all", label: "Усі" },
  { value: "upcoming", label: "Скоро" },
  { value: "live", label: "Наживо" },
  { value: "finished", label: "Завершені" },
] as const;

function normalizeMatchFilter(value?: string) {
  if (!value || value === "all") {
    return "all";
  }

  return isMatchStatus(value) ? value : "all";
}

function buildMatchesHref(status: string) {
  return status === "all" ? "/matches" : `/matches?status=${status}`;
}

export async function generateMetadata({
  searchParams,
}: MatchesPageProps): Promise<Metadata> {
  const { status } = await searchParams;
  const normalizedStatus = normalizeMatchFilter(status);
  const title =
    normalizedStatus === "all"
      ? "Матчі"
      : `Матчі - ${matchFilters.find((item) => item.value === normalizedStatus)?.label ?? "Матчі"}`;
  const description =
    "Публічний розділ матчів Rugby Ukraine: найближчі ігри, live-статуси та останні результати.";

  return {
    title: buildTitle(title),
    description,
    alternates: {
      canonical: buildMatchesHref(normalizedStatus),
    },
    openGraph: {
      title: buildTitle(title),
      description,
      url: `${siteConfig.url}${buildMatchesHref(normalizedStatus)}`,
      type: "website",
    },
  };
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const { status } = await searchParams;
  const normalizedStatus = normalizeMatchFilter(status);
  const { schedule, results } = await getPublicMatches(normalizedStatus);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeksAhead = new Date(today);
  twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

  const editorialMatches = getEditorialMatchCards();
  const editorialScheduleBase = editorialMatches
    .filter(
      (match) =>
        (match.status === "upcoming" || match.status === "live") &&
        match.parsedDate &&
        match.parsedDate >= today &&
        match.parsedDate <= twoWeeksAhead,
    )
    .sort(
      (a, b) =>
        (a.parsedDate?.getTime() ?? Number.MAX_SAFE_INTEGER) -
        (b.parsedDate?.getTime() ?? Number.MAX_SAFE_INTEGER),
    );
  const editorialResultsBase = editorialMatches
    .filter((match) => match.status === "finished")
    .sort(
      (a, b) =>
        (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0),
    )
    .slice(0, 8);

  const databaseScheduleSignatures = new Set(
    schedule.map((match) =>
      buildEditorialMatchSignature({
        championshipSlug: match.championship.slug,
        round: match.round,
        homeName: match.homeTeam.name,
        awayName: match.awayTeam.name,
      }),
    ),
  );
  const databaseResultSignatures = new Set(
    results.map((match) =>
      buildEditorialMatchSignature({
        championshipSlug: match.championship.slug,
        round: match.round,
        homeName: match.homeTeam.name,
        awayName: match.awayTeam.name,
      }),
    ),
  );

  const editorialSchedule = editorialScheduleBase
    .filter((match) =>
      normalizedStatus === "live"
        ? match.status === "live"
        : normalizedStatus === "upcoming"
          ? match.status === "upcoming"
          : true,
    )
    .filter((match) => {
      if (!match.parsedTeams) {
        return true;
      }

      return !databaseScheduleSignatures.has(
        buildEditorialMatchSignature({
          championshipSlug: match.championshipSlug,
          round: match.round,
          homeName: match.parsedTeams.homeName,
          awayName: match.parsedTeams.awayName,
        }),
      );
    });

  const editorialResults = editorialResultsBase.filter((match) => {
    if (!match.parsedTeams) {
      return true;
    }

    return !databaseResultSignatures.has(
      buildEditorialMatchSignature({
        championshipSlug: match.championshipSlug,
        round: match.round,
        homeName: match.parsedTeams.homeName,
        awayName: match.parsedTeams.awayName,
      }),
    );
  });

  const combinedSchedule = [
    ...editorialSchedule,
    ...schedule,
  ].sort((a, b) => {
    const aTime =
      "parsedDate" in a ? (a.parsedDate?.getTime() ?? Number.MAX_SAFE_INTEGER) : a.date.getTime();
    const bTime =
      "parsedDate" in b ? (b.parsedDate?.getTime() ?? Number.MAX_SAFE_INTEGER) : b.date.getTime();
    return aTime - bTime;
  });

  const combinedResults = [
    ...editorialResults,
    ...results,
  ].sort((a, b) => {
    const aTime = "parsedDate" in a ? (a.parsedDate?.getTime() ?? 0) : a.date.getTime();
    const bTime = "parsedDate" in b ? (b.parsedDate?.getTime() ?? 0) : b.date.getTime();
    return bTime - aTime;
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Матчі"
        description="Тут зібрані найближчі матчі, live-статуси та останні результати. Розклад і статуси в цьому розділі оновлюються редакційно, тому варто сприймати їх як оперативну довідку, а не як офіційний матч-центр."
      />

      <section className="content-card rounded-[1.5rem] p-5 text-sm leading-7 text-slate-600">
        <p>
          Матчевий розділ має редакційно-довідковий характер. Для
          ключових ігор ми показуємо дату, статус, рахунок і турнірний контекст,
          але офіційним джерелом остаточних рахунків лишаються організатори турніру.
        </p>
        <p className="mt-3">
          Якщо вам потрібне саме офіційне підтвердження рахунку або статусу
          матчу, краще звірятися з турнірним оператором, федерацією чи клубом.
        </p>
      </section>

      <section className="content-card rounded-[1.5rem] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-900">Статус:</span>
          {matchFilters.map((filter) => (
            <Link
              key={filter.value}
              href={buildMatchesHref(filter.value)}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                normalizedStatus === filter.value
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>

      {(normalizedStatus === "all" || normalizedStatus === "upcoming" || normalizedStatus === "live") && (
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Розклад
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Найближчі матчі
            </h2>
          </div>

          {combinedSchedule.length > 0 ? (
            <div className="space-y-4">
              {combinedSchedule.map((match) =>
                "parsedDate" in match ? (
                  <article
                    key={match.id}
                    className="content-card rounded-[1.5rem] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {match.championshipTitle} • {match.round}
                        </p>
                        {match.parsedTeams ? (
                          <div className="mt-2">
                            <MatchTeamsDisplay
                              homeName={match.parsedTeams.homeName}
                              awayName={match.parsedTeams.awayName}
                              homeLogo={match.parsedTeams.homeLogo}
                              awayLogo={match.parsedTeams.awayLogo}
                              homeScore={match.parsedTeams.homeScore}
                              awayScore={match.parsedTeams.awayScore}
                              teamNameClassName="text-lg font-semibold text-slate-950"
                            />
                          </div>
                        ) : (
                          <h3 className="mt-1 text-xl font-semibold leading-tight text-slate-950">
                            {match.teams}
                          </h3>
                        )}
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          match.status === "live"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {match.status === "live" ? "Наживо" : "Скоро"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="flex flex-col gap-1 text-sm text-slate-600">
                        <p>{match.kickoffText}</p>
                        <p>{match.venueText}</p>
                      </div>

                      <div className="rounded-[1rem] bg-slate-50 px-4 py-3 text-center">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          Турнір
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">
                          {match.championshipTitle}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/championships/${match.championshipSlug}`}
                      className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                    >
                      До сторінки чемпіонату
                    </Link>
                  </article>
                ) : (
                <article
                  key={match.id}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {match.championship.title} • {match.round}
                      </p>
                      <div className="mt-2">
                        <MatchTeamsDisplay
                          homeName={match.homeTeam.name}
                          awayName={match.awayTeam.name}
                          homeLogo={match.homeTeam.image ?? undefined}
                          awayLogo={match.awayTeam.image ?? undefined}
                          homeScore={match.homeScore}
                          awayScore={match.awayScore}
                          teamNameClassName="text-lg font-semibold text-slate-950"
                        />
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                    >
                      {getMatchStatusLabel(match.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <p>{formatDateTime(match.date)}</p>
                      <p>{match.location}</p>
                    </div>

                    <div className="rounded-[1rem] bg-slate-50 px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        Статус
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {getMatchStatusLabel(match.status)}
                      </p>
                    </div>
                  </div>

                  {match.homeScore !== null && match.awayScore !== null ? (
                    <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                      Рахунок: {match.homeScore}:{match.awayScore}
                    </p>
                  ) : null}

                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Детальніше про матч
                  </Link>
                </article>
                ),
              )}
            </div>
          ) : (
            <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
              За цим статусом найближчих матчів поки немає.
            </section>
          )}
        </section>
      )}

      {(normalizedStatus === "all" || normalizedStatus === "finished") && (
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Результати
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Останні рахунки
            </h2>
          </div>

          {combinedResults.length > 0 ? (
            <div className="space-y-4">
              {combinedResults.map((match) =>
                "parsedDate" in match ? (
                  <article
                    key={match.id}
                    className="content-card rounded-[1.5rem] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {match.championshipTitle} • {match.round}
                        </p>
                        {match.parsedTeams ? (
                          <div className="mt-2">
                            <MatchTeamsDisplay
                              homeName={match.parsedTeams.homeName}
                              awayName={match.parsedTeams.awayName}
                              homeLogo={match.parsedTeams.homeLogo}
                              awayLogo={match.parsedTeams.awayLogo}
                              homeScore={match.parsedTeams.homeScore}
                              awayScore={match.parsedTeams.awayScore}
                              teamNameClassName="text-lg font-semibold text-slate-950"
                            />
                          </div>
                        ) : (
                          <h3 className="mt-1 text-xl font-semibold leading-tight text-slate-950">
                            {match.teams}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                          Результат
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600">
                      <p>{match.kickoffText}</p>
                      <p>{match.venueText}</p>
                    </div>

                    <Link
                      href={`/championships/${match.championshipSlug}`}
                      className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                    >
                      До сторінки чемпіонату
                    </Link>
                  </article>
                ) : (
                <article
                  key={match.id}
                  className="content-card rounded-[1.5rem] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {match.championship.title} • {match.round}
                      </p>
                      <div className="mt-2">
                        <MatchTeamsDisplay
                          homeName={match.homeTeam.name}
                          awayName={match.awayTeam.name}
                          homeLogo={match.homeTeam.image ?? undefined}
                          awayLogo={match.awayTeam.image ?? undefined}
                          homeScore={match.homeScore}
                          awayScore={match.awayScore}
                          teamNameClassName="text-lg font-semibold text-slate-950"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                      >
                        {getMatchStatusLabel(match.status)}
                      </span>
                      <span className="rounded-[1rem] bg-slate-50 px-4 py-3 text-2xl font-semibold text-slate-950">
                        {match.homeScore}:{match.awayScore}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600">
                    <p>{formatDateTime(match.date)}</p>
                    <p>{match.location}</p>
                  </div>

                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Детальніше про матч
                  </Link>
                </article>
                ),
              )}
            </div>
          ) : (
            <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
              За цим статусом результатів поки немає.
            </section>
          )}
        </section>
      )}
    </div>
  );
}
