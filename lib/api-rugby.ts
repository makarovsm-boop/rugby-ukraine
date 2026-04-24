type ChampionshipLike = {
  slug: string;
  title: string;
  season: string;
};

type ApiLeagueEntry = {
  id: number;
  name: string;
};

export type ChampionshipStandingRow = {
  position: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
};

export type ApiRugbyStandingsResult = {
  rows: ChampionshipStandingRow[] | null;
  source: "api" | "local";
  message: string;
};

type ApiRugbyResponse = {
  ok: boolean;
  status: number;
  payload: any;
  error: string | null;
};

const API_RUGBY_BASE_URL = "https://v1.rugby.api-sports.io";
const SCRUMBASE_BASE_URL = "https://scrumbase.app/api";

const leagueSearchMap: Record<string, string> = {
  "six-nations": "Six Nations",
  "european-championship": "Rugby Europe Championship",
  "premiership-rugby": "Premiership Rugby",
  "united-rugby-championship": "United Rugby Championship",
  "investec-champions-cup": "European Rugby Champions Cup",
  "champions-cup": "European Rugby Champions Cup",
};

function getApiRugbyKey() {
  return process.env.API_RUGBY_KEY?.trim() || "";
}

function getSeasonCandidates(season: string) {
  const fourDigitYears = [...season.matchAll(/\d{4}/g)].map((match) =>
    Number(match[0]),
  );

  if (fourDigitYears.length >= 2) {
    return [...new Set(fourDigitYears)];
  }

  const splitYears = [...season.matchAll(/\b(\d{4})\s*\/\s*(\d{2})\b/g)].flatMap(
    (match) => {
      const startYear = Number(match[1]);
      const endYearSuffix = Number(match[2]);
      const centuryBase = Math.floor(startYear / 100) * 100;
      const endYear = centuryBase + endYearSuffix;

      return [startYear, endYear];
    },
  );

  const candidates = [...new Set([...fourDigitYears, ...splitYears])].filter(
    (year) => Number.isFinite(year) && year > 0,
  );

  return candidates;
}

function getLeagueSearchTerm(championship: ChampionshipLike) {
  const mappedBySlug = leagueSearchMap[championship.slug];

  if (mappedBySlug) {
    return mappedBySlug;
  }

  if (/six nations/i.test(championship.title)) {
    return "Six Nations";
  }

  if (/investec|champions cup/i.test(championship.title)) {
    return "European Rugby Champions Cup";
  }

  return championship.title;
}

function getLeagueSearchCandidates(championship: ChampionshipLike) {
  const primary = getLeagueSearchTerm(championship);
  const candidates = new Set<string>([primary, championship.title]);

  if (championship.slug === "united-rugby-championship") {
    candidates.add("United Rugby Championship");
    candidates.add("URC");
  }

  if (championship.slug === "six-nations") {
    candidates.add("Six Nations");
  }

  if (
    championship.slug === "investec-champions-cup" ||
    championship.slug === "champions-cup"
  ) {
    candidates.add("European Rugby Champions Cup");
    candidates.add("Champions Cup");
    candidates.add("Investec Champions Cup");
  }

  return [...candidates].filter(Boolean);
}

async function fetchApiRugby(
  path: string,
  searchParams: Record<string, string>,
): Promise<ApiRugbyResponse | null> {
  const apiKey = getApiRugbyKey();

  if (!apiKey) {
    return null;
  }

  const url = new URL(path, API_RUGBY_BASE_URL);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      next: {
        revalidate: 1800,
      },
    });

    const payload = await response.json().catch(() => null);
    const apiError = extractApiError(payload);

    return {
      ok: response.ok,
      status: response.status,
      payload,
      error: apiError ?? (!response.ok ? `HTTP ${response.status}` : null),
    };
  } catch {
    return null;
  }
}

async function fetchScrumbaseStandings(
  league: string,
  season: string,
): Promise<ApiRugbyResponse | null> {
  const url = new URL("/standings", SCRUMBASE_BASE_URL);
  url.searchParams.set("league", league);
  url.searchParams.set("season", season);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 1800,
      },
    });

    const payload = await response.json().catch(() => null);
    const apiError = extractApiError(payload);

    return {
      ok: response.ok,
      status: response.status,
      payload,
      error: apiError ?? (!response.ok ? `HTTP ${response.status}` : null),
    };
  } catch {
    return null;
  }
}

function extractApiError(payload: any) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const errors = payload.errors;

  if (typeof errors === "string" && errors.trim()) {
    return errors.trim();
  }

  if (errors && typeof errors === "object") {
    const messages = Object.values(errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((value) => String(value).trim())
      .filter(Boolean);

    return messages[0] ?? null;
  }

  return null;
}

function normalizeLeagueEntry(entry: any): ApiLeagueEntry | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const id =
    typeof entry?.league?.id === "number"
      ? entry.league.id
      : typeof entry?.id === "number"
        ? entry.id
        : null;

  const name = String(entry?.league?.name ?? entry?.name ?? "").trim();

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
  };
}

function findLeagueId(payload: any, searchCandidates: string[]) {
  const response = Array.isArray(payload?.response) ? payload.response : [];
  const leagues = response
    .map(normalizeLeagueEntry)
    .filter((entry: ApiLeagueEntry | null): entry is ApiLeagueEntry => Boolean(entry));

  if (leagues.length === 0) {
    return null;
  }

  const normalizedCandidates = searchCandidates.map((candidate) =>
    candidate.trim().toLowerCase(),
  );

  const exactMatch = leagues.find((league: ApiLeagueEntry) =>
    normalizedCandidates.includes(league.name.toLowerCase()),
  );

  if (exactMatch) {
    return exactMatch.id;
  }

  const partialMatch = leagues.find((league: ApiLeagueEntry) =>
    normalizedCandidates.some((candidate: string) =>
      league.name.toLowerCase().includes(candidate),
    ),
  );

  if (partialMatch) {
    return partialMatch.id;
  }

  return leagues[0]?.id ?? null;
}

function flattenStandings(input: any): any[] {
  if (Array.isArray(input)) {
    return input.flatMap(flattenStandings);
  }

  if (!input || typeof input !== "object") {
    return [];
  }

  const hasStandingShape =
    typeof input.rank === "number" ||
    typeof input.position === "number";

  const hasTeamShape =
    typeof input.name === "string" ||
    typeof input?.team?.name === "string";

  if (hasStandingShape && hasTeamShape) {
    return [input];
  }

  if ("standings" in input) {
    return flattenStandings(input.standings);
  }

  if ("table" in input) {
    return flattenStandings(input.table);
  }

  if ("data" in input) {
    return flattenStandings(input.data);
  }

  return [];
}

function normalizeStandingRow(row: any): ChampionshipStandingRow | null {
  const position = Number(row?.rank ?? row?.position ?? 0);
  const name = String(row?.team?.name ?? row?.name ?? "").trim();
  const played = Number(row?.all?.played ?? row?.played ?? row?.games?.played ?? 0);
  const won = Number(row?.all?.win ?? row?.won ?? row?.games?.win ?? 0);
  const lost = Number(row?.all?.lose ?? row?.lost ?? row?.games?.lose ?? 0);
  const points = Number(row?.points ?? row?.pts ?? row?.total ?? 0);

  if (!position || !name) {
    return null;
  }

  return {
    position,
    name,
    played,
    won,
    lost,
    points,
  };
}

function createFallbackMessage(details?: string) {
  if (!details) {
    return "Зовнішні джерела поки не повернули таблицю для цього турніру. Тимчасово показуємо локальні дані з бази сайту.";
  }

  return `Зовнішні джерела поки не повернули таблицю для цього турніру (${details}). Тимчасово показуємо локальні дані з бази сайту.`;
}

export async function getApiRugbyStandingsResult(
  championship: ChampionshipLike,
): Promise<ApiRugbyStandingsResult> {
  try {
    const apiKey = getApiRugbyKey();

    if (!apiKey) {
      return {
        rows: null,
        source: "local",
        message:
          "API_RUGBY_KEY не налаштований, тому зараз показуємо локальну таблицю з бази сайту.",
      };
    }

    const seasons = getSeasonCandidates(championship.season);

    if (seasons.length === 0) {
      return {
        rows: null,
        source: "local",
        message: createFallbackMessage("не вдалося розпізнати сезон"),
      };
    }

    const searchCandidates = getLeagueSearchCandidates(championship);
    const errors: string[] = [];

    for (const season of seasons) {
      let leagueId: number | null = null;

      for (const candidate of searchCandidates) {
        const leaguesResponse = await fetchApiRugby("/leagues", {
          search: candidate,
          season: String(season),
        });

        if (leaguesResponse?.error) {
          errors.push(leaguesResponse.error);
        }

        leagueId = findLeagueId(leaguesResponse?.payload, searchCandidates);

        if (leagueId) {
          break;
        }
      }

      if (!leagueId) {
        for (const candidate of searchCandidates) {
          const leaguesResponse = await fetchApiRugby("/leagues", {
            search: candidate,
          });

          if (leaguesResponse?.error) {
            errors.push(leaguesResponse.error);
          }

          leagueId = findLeagueId(leaguesResponse?.payload, searchCandidates);

          if (leagueId) {
            break;
          }
        }
      }

      if (!leagueId) {
        continue;
      }

      const standingsResponse = await fetchApiRugby("/standings", {
        league: String(leagueId),
        season: String(season),
      });

      if (standingsResponse?.error) {
        errors.push(standingsResponse.error);
      }

      const flattened = flattenStandings(standingsResponse?.payload?.response);
      const rows = flattened
        .map(normalizeStandingRow)
        .filter((row): row is ChampionshipStandingRow => Boolean(row))
        .sort((a, b) => a.position - b.position);

      if (rows.length > 0) {
        return {
          rows,
          source: "api",
          message: "Таблиця оновлюється з API-RUGBY.",
        };
      }

      const standingsWithoutSeason = await fetchApiRugby("/standings", {
        league: String(leagueId),
      });

      if (standingsWithoutSeason?.error) {
        errors.push(standingsWithoutSeason.error);
      }

      const rowsWithoutSeason = flattenStandings(
        standingsWithoutSeason?.payload?.response,
      )
        .map(normalizeStandingRow)
        .filter((row): row is ChampionshipStandingRow => Boolean(row))
        .sort((a, b) => a.position - b.position);

      if (rowsWithoutSeason.length > 0) {
        return {
          rows: rowsWithoutSeason,
          source: "api",
          message: "Таблиця оновлюється з API-RUGBY.",
        };
      }
    }

    for (const season of seasons) {
      for (const candidate of searchCandidates) {
        const scrumbaseResponse = await fetchScrumbaseStandings(
          candidate,
          String(season),
        );

        if (scrumbaseResponse?.error) {
          errors.push(`Scrumbase: ${scrumbaseResponse.error}`);
        }

        const scrumbaseRows = flattenStandings(scrumbaseResponse?.payload)
          .map(normalizeStandingRow)
          .filter((row): row is ChampionshipStandingRow => Boolean(row))
          .sort((a, b) => a.position - b.position);

        if (scrumbaseRows.length > 0) {
          return {
            rows: scrumbaseRows,
            source: "api",
            message: "Таблиця оновлюється із зовнішнього джерела Scrumbase.",
          };
        }
      }
    }

    const uniqueErrors = [...new Set(errors)].filter(Boolean);

    return {
      rows: null,
      source: "local",
      message: createFallbackMessage(uniqueErrors[0]),
    };
  } catch {
    return {
      rows: null,
      source: "local",
      message: createFallbackMessage("невідома помилка інтеграції"),
    };
  }
}
