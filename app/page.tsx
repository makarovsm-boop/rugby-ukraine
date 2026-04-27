import type { Metadata } from "next";
import Link from "next/link";
import { MatchTeamsDisplay } from "@/components/match-teams-display";
import { TeamBadge } from "@/components/team-badge";
import {
  extractTags,
  formatDate,
  formatDateTime,
  getHomePageData,
} from "@/lib/db";
import { championships as championshipOverrides } from "@/lib/championship-data";
import { buildTeamLogoMap, getParsedMatchTeamsWithLogos } from "@/lib/match-teams";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
} from "@/lib/match-status";
import { buildTitle, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Головна"),
  description:
    "Головна сторінка Rugby Ukraine: новини, матчі, результати, чемпіонати, команди й матеріали для новачків.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: buildTitle("Головна"),
    description:
      "Головна сторінка Rugby Ukraine: новини, матчі, результати, чемпіонати, команди й матеріали для новачків.",
    url: siteConfig.url,
    type: "website",
  },
};

function getEditorialLiveMatch() {
  for (const championship of championshipOverrides) {
    const liveMatch = championship.matches.find((match) =>
      match.round.toLowerCase().includes("наживо"),
    );

    if (liveMatch) {
      return {
        championshipTitle: championship.title,
        championshipSlug: championship.slug,
        round: liveMatch.round,
        teams: liveMatch.teams,
        date: liveMatch.date,
        parsedTeams: getParsedMatchTeamsWithLogos(
          liveMatch.teams,
          buildTeamLogoMap(championship.standings),
        ),
      };
    }
  }

  return null;
}

export default async function Home() {
  const { articles, championships, teams, matches, results } =
    await getHomePageData();
  const ukrainianTeam =
    teams.find((team) => team.country === "Україна" || team.level === "Збірна") ??
    teams[0];
  const featuredArticle = articles[0];
  const editorialLiveMatch = getEditorialLiveMatch();
  const featuredMatch = matches[0];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:gap-10 lg:px-8">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-[0_16px_48px_rgba(15,23,42,0.18)] sm:px-8 lg:grid-cols-[1.3fr_0.8fr] lg:px-10 lg:py-10">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Українське регбі у фокусі
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Усе головне про українське регбі та ключові події сезону в одному місці
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Новини, матчі, результати й базові пояснення зібрані так, щоб
              українському вболівальнику було легко стежити за збірною, клубним
              сезоном і розвитком гри без зайвого шуму та плутанини.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              Читати новини
            </Link>
            <Link
              href="/matches"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Дивитися матчі
            </Link>
            <Link
              href="/beginners"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Для новачків
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
            <p className="text-sm text-slate-300">У центрі уваги</p>
            {editorialLiveMatch?.parsedTeams ? (
              <div className="mt-3">
                <MatchTeamsDisplay
                  homeName={editorialLiveMatch.parsedTeams.homeName}
                  awayName={editorialLiveMatch.parsedTeams.awayName}
                  homeLogo={editorialLiveMatch.parsedTeams.homeLogo}
                  awayLogo={editorialLiveMatch.parsedTeams.awayLogo}
                  homeScore={editorialLiveMatch.parsedTeams.homeScore}
                  awayScore={editorialLiveMatch.parsedTeams.awayScore}
                  teamNameClassName="text-base font-semibold text-white"
                  className="sm:flex-col sm:items-start lg:flex-row lg:items-center"
                />
              </div>
            ) : featuredMatch ? (
              <div className="mt-3">
                <MatchTeamsDisplay
                  homeName={featuredMatch.homeTeam.name}
                  awayName={featuredMatch.awayTeam.name}
                  homeLogo={featuredMatch.homeTeam.image ?? undefined}
                  awayLogo={featuredMatch.awayTeam.image ?? undefined}
                  homeScore={featuredMatch.homeScore}
                  awayScore={featuredMatch.awayScore}
                  teamNameClassName="text-base font-semibold text-white"
                  className="sm:flex-col sm:items-start lg:flex-row lg:items-center"
                />
              </div>
            ) : (
              <p className="mt-3 text-xl font-semibold">Матчі скоро з'являться</p>
            )}
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {editorialLiveMatch
                ? `${editorialLiveMatch.championshipTitle} • ${editorialLiveMatch.round}`
                : featuredMatch
                ? `${featuredMatch.championship.title} • ${featuredMatch.round}`
                : "Стежте за оновленнями календаря найближчим часом."}
            </p>
            <p className="mt-2 text-sm text-emerald-200">
              {editorialLiveMatch
                ? editorialLiveMatch.date
                : featuredMatch
                ? formatDateTime(featuredMatch.date)
                : ""}
            </p>
            {editorialLiveMatch || featuredMatch ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    editorialLiveMatch
                      ? getMatchStatusClasses("live")
                      : getMatchStatusClasses(featuredMatch.status)
                  }`}
                >
                  {editorialLiveMatch
                    ? getMatchStatusLabel("live")
                    : getMatchStatusLabel(featuredMatch.status)}
                </span>
                <Link
                  href={
                    editorialLiveMatch
                      ? `/championships/${editorialLiveMatch.championshipSlug}`
                      : `/matches/${featuredMatch.id}`
                  }
                  className="text-sm font-semibold text-emerald-200 transition-colors hover:text-white"
                >
                  {editorialLiveMatch ? "До чемпіонату" : "До матчу"}
                </Link>
              </div>
            ) : null}
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
            <p className="text-sm text-slate-300">Український акцент</p>
            <p className="mt-3 text-xl font-semibold">
              {ukrainianTeam?.name ?? "Збірна України та ключові команди"}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {ukrainianTeam
                ? `${ukrainianTeam.country} • ${ukrainianTeam.level}. ${ukrainianTeam.description}`
                : "Ми окремо підсвічуємо все, що важливо для українського регбі."}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
            <p className="text-sm text-slate-300">З чого почати</p>
            <p className="mt-3 text-xl font-semibold">
              Спершу зрозумійте логіку матчу, а вже потім занурюйтесь у деталі
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Короткі пояснення допоможуть розібратися в рахунку, позиціях і
              ключових епізодах без перевантаження термінами.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="content-card rounded-[1.5rem] p-5">
          <p className="text-sm text-slate-500">Актуальних новин</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {articles.length}
          </p>
        </div>
        <div className="content-card rounded-[1.5rem] p-5">
          <p className="text-sm text-slate-500">Матчів у фокусі</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {matches.length}
          </p>
        </div>
        <div className="content-card rounded-[1.5rem] p-5">
          <p className="text-sm text-slate-500">Команд і збірних</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {teams.length}
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Новини
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Що справді варте уваги просто зараз
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Від складу збірної й форми команд до турнірного контексту та
              редакційних пояснень, які допомагають швидко зрозуміти вагу новини.
            </p>
          </div>
          <Link href="/news" className="text-sm font-semibold text-[var(--accent)]">
            Усі новини
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {articles.map((article) => {
            const tags = extractTags(article.tags);

            return (
              <article
                key={article.slug}
                className="content-card rounded-[1.5rem] p-6"
              >
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                    {tags[0] ?? "Новина"}
                  </span>
                  <span>{formatDate(article.date)}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                    {article.slug === featuredArticle?.slug
                      ? "Головний матеріал дня"
                      : "Оновлено редакцією"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/news"
                      className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      Увесь розділ
                    </Link>
                    <Link
                      href={`/news/${encodeURIComponent(article.slug)}`}
                      className="text-sm font-semibold text-[var(--accent)]"
                    >
                      Читати далі
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Матчі
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Коли грають і де шукати головну інтригу
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Найближчі матчі зібрані так, щоб відразу було видно турнір, статус,
              час початку і контекст, у якому цей матч має найбільшу вагу.
            </p>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                    >
                      {getMatchStatusLabel(match.status)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {formatDateTime(match.date)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">{match.location}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/matches"
                      className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      Усі матчі
                    </Link>
                    <Link
                      href={`/matches/${match.id}`}
                      className="text-sm font-semibold text-[var(--accent)]"
                    >
                      Детальніше про матч
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Результати
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Останні підсумки і рахунки
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Якщо ви пропустили гру, тут можна швидко побачити рахунок, статус
              матчу і зрозуміти, які результати вже вплинули на розклад сил.
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <article
                key={result.id}
                className="content-card rounded-[1.5rem] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      {result.championship.title} • {result.round}
                    </p>
                    <div className="mt-2">
                      <MatchTeamsDisplay
                        homeName={result.homeTeam.name}
                        awayName={result.awayTeam.name}
                        homeLogo={result.homeTeam.image ?? undefined}
                        awayLogo={result.awayTeam.image ?? undefined}
                        homeScore={result.homeScore}
                        awayScore={result.awayScore}
                        teamNameClassName="text-base font-semibold text-slate-950"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(result.status)}`}
                    >
                      {getMatchStatusLabel(result.status)}
                    </span>
                    <span className="text-2xl font-semibold text-slate-950">
                      {result.homeScore}:{result.awayScore}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {formatDateTime(result.date)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Чемпіонати
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                Турніри у центрі уваги
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Короткий зріз по турнірах, які найчастіше формують порядок денний
                для українського читача саме зараз.
              </p>
            </div>
            <Link
              href="/championships"
              className="text-sm font-semibold text-[var(--accent)]"
            >
              Усі турніри
            </Link>
          </div>

          <div className="space-y-4">
            {championships.map((championship) => (
              <article
                key={championship.id}
                className="content-card rounded-[1.5rem] p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {championship.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {championship.region}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {championship.description}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  Формат: {championship.format} • Сезон {championship.season}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Команди
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                За ким стежити
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Збірна України, клуби з різних ліг і команди, матчі яких найчастіше
                дають контекст для новин, результатів і окремих гравців.
              </p>
            </div>
            <Link href="/teams" className="text-sm font-semibold text-[var(--accent)]">
              Усі команди
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {teams.map((team) => (
              <article
                key={team.id}
                className="content-card rounded-[1.5rem] p-6"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      <TeamBadge
                        name={team.name}
                        logo={team.image ?? undefined}
                        nameClassName="text-lg font-semibold text-slate-950"
                      />
                    </h3>
                    <p className="text-sm text-slate-500">
                      {team.country} • {team.level}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {team.description}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  Домашня арена: {team.stadium}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fffc_100%)] px-6 py-8 shadow-[0_16px_40px_rgba(11,31,58,0.05)] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-700">
              Для новачків
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Почніть з трьох простих кроків і дивіться матчі впевненіше
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Якщо регбі поки здається хаотичним, ми допоможемо швидко зібрати
              базову картину: як набираються очки, хто за що відповідає на полі
              і на які моменти дивитися під час трансляції.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-950">1. Правила</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Розберіться, за що дають очки, чому зупиняється гра і як виглядає
                базова логіка володіння.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-950">2. Позиції</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Дізнайтеся, хто веде силову боротьбу, хто розганяє атаку і хто
                ухвалює ключові рішення в грі.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-sm font-semibold text-slate-950">
                3. Як дивитися матч
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Навчіться помічати рахунок, темп, боротьбу за територію і
                вирішальні відрізки в трансляції.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
