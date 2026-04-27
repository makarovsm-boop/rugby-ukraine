import { prisma } from "@/lib/prisma";
import { getMatchStatusSortOrder } from "@/lib/match-status";
import {
  getEditorialArticleBySlug,
  mergeEditorialArticles,
} from "@/lib/editorial-news";

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function extractTags(tags: unknown) {
  return Array.isArray(tags) ? tags.map(String) : [];
}

export async function getHomePageData() {
  const [articles, championships, teams, matches, results] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.championship.findMany({
      orderBy: { title: "asc" },
      take: 3,
    }),
    prisma.team.findMany({
      orderBy: { name: "asc" },
      take: 4,
    }),
    prisma.match.findMany({
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { date: "asc" },
      take: 3,
      where: {
        status: {
          in: ["upcoming", "live"],
        },
      },
    }),
    prisma.match.findMany({
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { date: "desc" },
      take: 3,
      where: {
        status: "finished",
      },
    }),
  ]);

  const prioritizedMatches = [...matches].sort(
    (a, b) =>
      getMatchStatusSortOrder(a.status) - getMatchStatusSortOrder(b.status) ||
      a.date.getTime() - b.date.getTime(),
  );

  return {
    articles: mergeEditorialArticles(articles).slice(0, 3),
    championships,
    teams,
    matches: prioritizedMatches,
    results,
  };
}

export async function getNewsList() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return mergeEditorialArticles(articles);
}

export const NEWS_PAGE_SIZE = 9;

export async function getPaginatedNewsList(page: number, limit = NEWS_PAGE_SIZE) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : NEWS_PAGE_SIZE;
  const skip = (safePage - 1) * safeLimit;

  const dbItems = await prisma.article.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  const mergedItems = mergeEditorialArticles(dbItems);
  const total = mergedItems.length;

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(safePage, totalPages);
  const currentSkip = (currentPage - 1) * safeLimit;
  const items = mergedItems.slice(currentSkip, currentSkip + safeLimit);

  if (currentPage !== safePage) {
    return {
      items,
      total,
      page: currentPage,
      limit: safeLimit,
      totalPages,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }

  return {
    items,
    total,
    page: currentPage,
    limit: safeLimit,
    totalPages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

export async function getAdminArticles() {
  const dbArticles = await prisma.article.findMany({
    orderBy: { date: "desc" },
  });

  return mergeEditorialArticles(dbArticles);
}

export async function getAdminComments() {
  return prisma.comment.findMany({
    include: {
      article: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCommentsFilters() {
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      title: true,
    },
    orderBy: { date: "desc" },
  });

  return articles;
}

export async function getFilteredAdminComments(filters?: {
  articleSlug?: string;
  freshness?: string;
}) {
  const articleSlug = filters?.articleSlug?.trim();
  const freshness = filters?.freshness?.trim() || "all";
  const now = new Date();

  let createdAtFilter: { gte?: Date } | undefined;

  if (freshness === "today") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    createdAtFilter = { gte: startOfDay };
  } else if (freshness === "7days") {
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);
    createdAtFilter = { gte: last7Days };
  } else if (freshness === "30days") {
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);
    createdAtFilter = { gte: last30Days };
  }

  return prisma.comment.findMany({
    where: {
      ...(articleSlug ? { article: { slug: articleSlug } } : {}),
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    },
    include: {
      article: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminDashboardData() {
  const [
    articlesCount,
    teamsCount,
    playersCount,
    championshipsCount,
    matchesCount,
    commentsCount,
    recentArticles,
    recentComments,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.team.count(),
    prisma.player.count(),
    prisma.championship.count(),
    prisma.match.count(),
    prisma.comment.count(),
    prisma.article.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        published: true,
        date: true,
      },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        article: {
          select: {
            slug: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return {
    stats: {
      articles: articlesCount,
      teams: teamsCount,
      players: playersCount,
      championships: championshipsCount,
      matches: matchesCount,
      comments: commentsCount,
    },
    recentArticles,
    recentComments,
  };
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function getPublicMatches(status?: string) {
  const where =
    status && status !== "all"
      ? {
          status,
        }
      : undefined;

  const matches = await prisma.match.findMany({
    where,
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: [{ date: "asc" }],
  });

  const schedule = matches
    .filter((match) => match.status === "upcoming" || match.status === "live")
    .sort(
      (a, b) =>
        getMatchStatusSortOrder(a.status) - getMatchStatusSortOrder(b.status) ||
        a.date.getTime() - b.date.getTime(),
    );

  const results = matches
    .filter((match) => match.status === "finished")
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    schedule,
    results,
  };
}

export async function getPublicMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
  });
}

export async function getAllPublicMatches() {
  return prisma.match.findMany({
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function getNewsArticle(slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return article ?? getEditorialArticleBySlug(slug);
}

export async function getAdminArticleBySlug(slug: string) {
  const normalizedSlug = slug.trim();
  let decodedSlug = normalizedSlug;

  try {
    decodedSlug = decodeURIComponent(normalizedSlug).trim();
  } catch {
    decodedSlug = normalizedSlug;
  }

  return prisma.article.findFirst({
    where: {
      OR: [{ slug: normalizedSlug }, { slug: decodedSlug }],
    },
    include: {
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRelatedNews(slug: string) {
  const dbArticles = await prisma.article.findMany({
    where: {
      published: true,
      NOT: { slug },
    },
    orderBy: { date: "desc" },
  });

  return mergeEditorialArticles(dbArticles)
    .filter((article) => article.slug !== slug)
    .slice(0, 2);
}

export async function getChampionships() {
  return prisma.championship.findMany({
    include: {
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });
}

export async function getChampionshipRegions() {
  const championships = await prisma.championship.findMany({
    select: {
      region: true,
    },
    orderBy: { region: "asc" },
  });

  return [...new Set(championships.map((championship) => championship.region))];
}

export async function getChampionshipsByRegion(region?: string) {
  return prisma.championship.findMany({
    where: region ? { region } : undefined,
    include: {
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });
}

export async function getChampionshipBySlug(slug: string) {
  return prisma.championship.findUnique({
    where: { slug },
    include: {
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
    },
  });
}

export async function getChampionshipByTitle(title: string) {
  return prisma.championship.findFirst({
    where: { title },
    include: {
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
    },
  });
}

export async function getAdminChampionships() {
  return prisma.championship.findMany({
    include: {
      matches: true,
    },
    orderBy: { title: "asc" },
  });
}

export async function getAdminChampionshipBySlug(slug: string) {
  return prisma.championship.findUnique({
    where: { slug },
    include: {
      matches: true,
    },
  });
}

export function buildStandings(
  matches: {
    homeTeam: { id: string; name: string };
    awayTeam: { id: string; name: string };
    status?: string;
    homeScore: number | null;
    awayScore: number | null;
  }[],
) {
  const table = new Map<
    string,
    {
      name: string;
      played: number;
      won: number;
      lost: number;
      points: number;
    }
  >();

  for (const match of matches) {
    for (const team of [match.homeTeam, match.awayTeam]) {
      if (!table.has(team.id)) {
        table.set(team.id, {
          name: team.name,
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
        });
      }
    }

    if (
      match.status === "upcoming" ||
      match.status === "live" ||
      match.homeScore === null ||
      match.awayScore === null
    ) {
      continue;
    }

    const home = table.get(match.homeTeam.id);
    const away = table.get(match.awayTeam.id);

    if (!home || !away) {
      continue;
    }

    home.played += 1;
    away.played += 1;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 4;
      away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += 4;
      home.lost += 1;
    }
  }

  return [...table.values()]
    .sort((a, b) => b.points - a.points || b.won - a.won || a.name.localeCompare(b.name))
    .map((team, index) => ({
      position: index + 1,
      ...team,
    }));
}

export async function getTeams() {
  return prisma.team.findMany({
    include: {
      homeMatches: {
        include: {
          championship: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
      awayMatches: {
        include: {
          championship: true,
          homeTeam: true,
        },
        orderBy: { date: "asc" },
      },
      players: {
        orderBy: [{ number: "asc" }, { name: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTeamFilterOptions() {
  const teams = await prisma.team.findMany({
    select: {
      country: true,
      level: true,
    },
    orderBy: [{ country: "asc" }, { level: "asc" }],
  });

  return {
    countries: [...new Set(teams.map((team) => team.country))],
    levels: [...new Set(teams.map((team) => team.level))],
  };
}

export async function getTeamsByFilters(filters?: { country?: string; level?: string }) {
  const { country, level } = filters ?? {};

  return prisma.team.findMany({
    where: {
      ...(country ? { country } : {}),
      ...(level ? { level } : {}),
    },
    include: {
      homeMatches: {
        include: {
          championship: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
      awayMatches: {
        include: {
          championship: true,
          homeTeam: true,
        },
        orderBy: { date: "asc" },
      },
      players: {
        orderBy: [{ number: "asc" }, { name: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTeamBySlug(slug: string) {
  return prisma.team.findUnique({
    where: { slug },
    include: {
      homeMatches: {
        include: {
          championship: true,
          awayTeam: true,
        },
        orderBy: { date: "asc" },
      },
      awayMatches: {
        include: {
          championship: true,
          homeTeam: true,
        },
        orderBy: { date: "asc" },
      },
      players: {
        orderBy: [{ number: "asc" }, { name: "asc" }],
      },
    },
  });
}

export async function getAdminTeams() {
  return prisma.team.findMany({
    include: {
      players: true,
      homeMatches: true,
      awayMatches: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getAdminTeamBySlug(slug: string) {
  return prisma.team.findUnique({
    where: { slug },
    include: {
      players: {
        orderBy: [{ number: "asc" }, { name: "asc" }],
      },
      homeMatches: true,
      awayMatches: true,
    },
  });
}

export async function getAdminPlayers() {
  return prisma.player.findMany({
    include: {
      team: true,
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function getAdminPlayerBySlug(slug: string) {
  return prisma.player.findUnique({
    where: { slug },
    include: {
      team: true,
    },
  });
}

export async function getTeamsForAdminSelect() {
  return prisma.team.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getChampionshipsForAdminSelect() {
  return prisma.championship.findMany({
    select: {
      id: true,
      title: true,
      season: true,
    },
    orderBy: { title: "asc" },
  });
}

export async function getAdminMatches() {
  return prisma.match.findMany({
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { date: "asc" },
  });
}

export async function getAdminMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
  });
}

export async function getPlayers() {
  return prisma.player.findMany({
    include: {
      team: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getPlayerBySlug(slug: string) {
  return prisma.player.findUnique({
    where: { slug },
    include: {
      team: true,
    },
  });
}

export async function getSearchIndex() {
  const [articles, championships, teams, players] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    }),
    prisma.championship.findMany({ orderBy: { title: "asc" } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.player.findMany({
      include: { team: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    articles,
    championships,
    teams,
    players,
  };
}
