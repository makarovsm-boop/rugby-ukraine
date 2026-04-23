import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { TrackedSearchForm } from "@/components/tracked-search-form";
import {
  extractTags,
  getSearchIndex,
} from "@/lib/db";

export const metadata: Metadata = {
  title: "Пошук | Rugby Ukraine",
  description: "Пошук по новинах, чемпіонатах, командах, гравцях і сторінках Rugby Ukraine.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type SearchResult = {
  title: string;
  excerpt: string;
  href: string;
  type: string;
  section: string;
  keywords: string[];
  meta?: string;
  score: number;
};

type SearchGroup = {
  key: string;
  label: string;
  count: number;
  items: SearchResult[];
};

const typeStyles: Record<string, string> = {
  "Новина": "bg-rose-50 text-rose-700",
  "Турнір": "bg-sky-50 text-sky-700",
  "Команда": "bg-emerald-50 text-emerald-700",
  "Гравець": "bg-amber-50 text-amber-700",
  "Сторінка": "bg-slate-100 text-slate-700",
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenizeQuery(query: string) {
  return normalizeText(query)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreSearchEntry(entry: Omit<SearchResult, "score">, tokens: string[]) {
  const title = normalizeText(entry.title);
  const excerpt = normalizeText(entry.excerpt);
  const section = normalizeText(entry.section);
  const type = normalizeText(entry.type);
  const meta = normalizeText(entry.meta ?? "");
  const keywords = entry.keywords.map((keyword) => normalizeText(keyword));

  let score = 0;

  for (const token of tokens) {
    if (title === token) {
      score += 120;
    } else if (title.startsWith(token)) {
      score += 80;
    } else if (title.includes(token)) {
      score += 50;
    }

    if (keywords.some((keyword) => keyword === token)) {
      score += 40;
    } else if (keywords.some((keyword) => keyword.includes(token))) {
      score += 24;
    }

    if (meta.includes(token)) {
      score += 20;
    }

    if (section.includes(token) || type.includes(token)) {
      score += 16;
    }

    if (excerpt.includes(token)) {
      score += 10;
    }
  }

  return score;
}

function groupResults(results: SearchResult[]): SearchGroup[] {
  const groups = new Map<string, SearchGroup>();

  for (const result of results) {
    if (!groups.has(result.type)) {
      groups.set(result.type, {
        key: result.type,
        label: result.type,
        count: 0,
        items: [],
      });
    }

    const group = groups.get(result.type);

    if (!group) {
      continue;
    }

    group.items.push(result);
    group.count += 1;
  }

  return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getSearchResultCta(type: string) {
  switch (type) {
    case "Новина":
      return "Відкрити новину";
    case "Команда":
      return "Відкрити команду";
    case "Гравець":
      return "Відкрити гравця";
    case "Турнір":
      return "Відкрити турнір";
    default:
      return "Відкрити сторінку";
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const tokens = tokenizeQuery(query);
  const dbData = await getSearchIndex();

  const staticEntries: Omit<SearchResult, "score">[] = [
    {
      title: "Для новачків",
      excerpt:
        "Базові правила регбі, пояснення позицій на полі та поради, як дивитися матч уперше.",
      href: "/beginners",
      type: "Сторінка",
      section: "Для новачків",
      meta: "Навчальний розділ",
      keywords: ["правила", "позиції", "як дивитися матч", "новачки", "регбі"],
    },
    {
      title: "Про проєкт",
      excerpt: "Коротко про редакційний сайт Rugby Ukraine та його основні розділи.",
      href: "/about",
      type: "Сторінка",
      section: "Про проєкт",
      meta: "Інформація про сайт",
      keywords: ["проєкт", "сайт", "rugby ukraine", "редакція"],
    },
  ];

  const allEntries: Omit<SearchResult, "score">[] = [
    ...dbData.articles.map((article) => ({
      title: article.title,
      excerpt: article.excerpt,
      href: `/news/${article.slug}`,
      type: "Новина",
      section: "Новини",
      meta: article.date.toLocaleDateString("uk-UA"),
      keywords: extractTags(article.tags),
    })),
    ...dbData.championships.map((championship) => ({
      title: championship.title,
      excerpt: championship.description,
      href: `/championships/${championship.slug}`,
      type: "Турнір",
      section: "Чемпіонати",
      meta: `${championship.season} • ${championship.region}`,
      keywords: [championship.season, championship.region, championship.format],
    })),
    ...dbData.teams.map((team) => ({
      title: team.name,
      excerpt: team.description,
      href: `/teams/${team.slug}`,
      type: "Команда",
      section: "Команди",
      meta: `${team.country} • ${team.level}`,
      keywords: [team.country, team.level, team.short, team.stadium],
    })),
    ...dbData.players.map((player) => ({
      title: player.name,
      excerpt: player.summary,
      href: `/players/${player.slug}`,
      type: "Гравець",
      section: "Гравці",
      meta: `${player.team.name} • ${player.position}`,
      keywords: [
        player.position,
        player.team.name,
        player.team.country,
        String(player.number),
      ],
    })),
    ...staticEntries,
  ];

  const results: SearchResult[] = tokens.length
    ? allEntries
        .map((entry) => ({
          ...entry,
          score: scoreSearchEntry(entry, tokens),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    : [];

  const groupedResults = groupResults(results);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Пошук"
        description="Пошук по основних розділах сайту: новини, чемпіонати, команди, гравці та базові редакційні сторінки."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <TrackedSearchForm
          eventSource="search_page"
          className="flex flex-col gap-3 sm:flex-row"
          inputClassName="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white"
          buttonClassName="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          defaultValue={query}
          placeholder="Наприклад: Україна, Leinster, правила"
        />
      </section>

      {query ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-950">
              Результати за запитом: &quot;{query}&quot;
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Знайдено: {results.length}</span>
              {groupedResults.map((group) => (
                <span
                  key={group.key}
                  className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700"
                >
                  {group.label}: {group.count}
                </span>
              ))}
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-8">
              {groupedResults.map((group) => (
                <section key={group.key} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">{group.label}</h3>
                    <span className="text-sm text-slate-500">{group.count} результатів</span>
                  </div>

                  <div className="grid gap-4">
                    {group.items.map((result) => (
                      <article
                        key={result.href}
                        className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
                      >
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span
                            className={`rounded-full px-3 py-1 font-medium ${typeStyles[result.type] ?? "bg-slate-100 text-slate-700"}`}
                          >
                            {result.type}
                          </span>
                          <span>{result.section}</span>
                          {result.meta ? <span className="text-slate-300">•</span> : null}
                          {result.meta ? <span>{result.meta}</span> : null}
                        </div>
                        <h4 className="mt-4 text-2xl font-semibold text-slate-950">
                          {result.title}
                        </h4>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {result.excerpt}
                        </p>
                        <Link
                          href={result.href}
                          className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]"
                        >
                          {getSearchResultCta(result.type)}
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">
                Нічого не знайдено
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Спробуйте інший запит: назву команди, турніру, гравця або базове
                слово на кшталт &quot;правила&quot;.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-slate-950">
            Введіть запит для пошуку
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Пошук працює по даних із бази й допомагає швидко знайти новини,
            чемпіонати, команди, гравців і базові довідкові сторінки.
          </p>
        </section>
      )}
    </div>
  );
}
