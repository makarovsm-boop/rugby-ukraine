import type { Metadata } from "next";
import Link from "next/link";
import { MatchTeamsDisplay } from "@/components/match-teams-display";
import { PageIntro } from "@/components/page-intro";
import { formatDateTime, getPublicMatches } from "@/lib/db";
import {
  championships as championshipOverrides,
  getChampionshipCanonicalSlug,
} from "@/lib/championship-data";
import { buildTeamLogoMap, getParsedMatchTeamsWithLogos } from "@/lib/match-teams";
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

const ukrainianMonthIndex: Record<string, number> = {
  січня: 0,
  лютого: 1,
  березня: 2,
  квітня: 3,
  травня: 4,
  червня: 5,
  липня: 6,
  серпня: 7,
  вересня: 8,
  жовтня: 9,
  листопада: 10,
  грудня: 11,
};

type EditorialMatchCard = {
  id: string;
  championshipTitle: string;
  championshipSlug: string;
  round: string;
  teams: string;
  parsedTeams: ReturnType<typeof getParsedMatchTeamsWithLogos>;
  venueText: string;
  kickoffText: string;
  parsedDate: Date | null;
  status: "upcoming" | "live" | "finished";
};

function parseEditorialMatchDate(round: string, date: string) {
  const sourceText = `${round} ${date}`;
  const match = sourceText.match(
    /(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)\s+(\d{4})/i,
  );

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = ukrainianMonthIndex[match[2].toLowerCase()];
  const year = Number(match[3]);
  const timeMatch = sourceText.match(/(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? Number(timeMatch[1]) : 12;
  const minutes = timeMatch ? Number(timeMatch[2]) : 0;

  return new Date(year, month, day, hours, minutes);
}

function getEditorialMatchCards() {
  const rawCards = championshipOverrides.flatMap((championship) =>
    championship.matches
      .filter((match) => !match.round.toLowerCase().includes("статус сезону"))
      .map((match) => {
        const parsedDate = parseEditorialMatchDate(match.round, match.date);
        const parsedTeams = getParsedMatchTeamsWithLogos(
          match.teams,
          buildTeamLogoMap(championship.standings),
        );
        const lowerRound = match.round.toLowerCase();
        const status = lowerRound.includes("наживо")
          ? "live"
          : lowerRound.includes("анонс") || lowerRound.includes("півфінал")
            ? "upcoming"
            : "finished";

        return {
          id: `${getChampionshipCanonicalSlug({ slug: championship.slug, title: championship.title })}-${match.round}-${match.teams}`,
          championshipTitle: championship.title,
          championshipSlug: getChampionshipCanonicalSlug({
            slug: championship.slug,
            title: championship.title,
          }),
          round: match.round,
          teams: match.teams,
          parsedTeams,
          venueText: match.location,
          kickoffText: match.date,
          parsedDate,
          status,
        } satisfies EditorialMatchCard;
      }),
  );

  const uniqueCards = new Map<string, EditorialMatchCard>();

  for (const card of rawCards) {
    const dedupeKey = [
      card.championshipSlug,
      card.round,
      card.teams,
      card.kickoffText,
      card.venueText,
    ].join("::");

    if (!uniqueCards.has(dedupeKey)) {
      uniqueCards.set(dedupeKey, card);
    }
  }

  return [...uniqueCards.values()];
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
  const editorialSchedule = editorialMatches
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
  const editorialResults = editorialMatches
    .filter((match) => match.status === "finished")
    .sort(
      (a, b) =>
        (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0),
    )
    .slice(0, 8);

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

          {editorialSchedule.length > 0 ? (
            <div className="space-y-4">
              {editorialSchedule.map((match) => (
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
              ))}
            </div>
          ) : schedule.length > 0 ? (
            <div className="space-y-4">
              {schedule.map((match) => (
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
              ))}
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

          {editorialResults.length > 0 ? (
            <div className="space-y-4">
              {editorialResults.map((match) => (
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
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((match) => (
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
              ))}
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
