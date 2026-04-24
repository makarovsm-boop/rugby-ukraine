type ChampionshipLike = {
  slug: string;
  title: string;
  season: string;
};

export type ChampionshipStandingRow = {
  position: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
};

const API_RUGBY_BASE_URL = "https://v1.rugby.api-sports.io";

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

function parseSeasonStart(season: string) {
  const match = season.match(/\d{4}/);

  return match ? Number(match[0]) : null;
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

async function fetchApiRugby(
  path: string,
  searchParams: Record<string, string>,
) {
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

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": apiKey,
    },
    next: {
      revalidate: 1800,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function extractLeagueId(payload: any) {
  const response = Array.isArray(payload?.response) ? payload.response : [];
  const firstItem = response[0];

  if (!firstItem || typeof firstItem !== "object") {
    return null;
  }

  if (typeof firstItem?.league?.id === "number") {
    return firstItem.league.id;
  }

  if (typeof firstItem?.id === "number") {
    return firstItem.id;
  }

  return null;
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

export async function getApiRugbyStandings(
  championship: ChampionshipLike,
): Promise<ChampionshipStandingRow[] | null> {
  const season = parseSeasonStart(championship.season);

  if (!season) {
    return null;
  }

  const search = getLeagueSearchTerm(championship);
  const leaguesPayload = await fetchApiRugby("/leagues", {
    search,
    season: String(season),
  });
  const leagueId = extractLeagueId(leaguesPayload);

  if (!leagueId) {
    return null;
  }

  const standingsPayload = await fetchApiRugby("/standings", {
    league: String(leagueId),
    season: String(season),
  });

  const flattened = flattenStandings(standingsPayload?.response);
  const rows = flattened
    .map(normalizeStandingRow)
    .filter((row): row is ChampionshipStandingRow => Boolean(row))
    .sort((a, b) => a.position - b.position);

  return rows.length > 0 ? rows : null;
}
