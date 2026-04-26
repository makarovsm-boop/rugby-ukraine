type StandingsEntry = {
  name: string;
  logo?: string;
};

function normalizeTeamName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

export function buildTeamLogoMap(standings: StandingsEntry[]) {
  return new Map(
    standings
      .filter((team) => Boolean(team.logo))
      .map((team) => [normalizeTeamName(team.name), team.logo as string]),
  );
}

export function parseMatchTeams(input: string) {
  const scoreMatch = input.match(/^(.*?)\s+(\d+):(\d+)\s+(.*?)$/);

  if (scoreMatch) {
    return {
      homeName: scoreMatch[1].trim(),
      homeScore: Number(scoreMatch[2]),
      awayScore: Number(scoreMatch[3]),
      awayName: scoreMatch[4].trim(),
    };
  }

  const versusMatch = input.match(/^(.*?)\s+vs\s+(.*?)$/i);

  if (versusMatch) {
    return {
      homeName: versusMatch[1].trim(),
      homeScore: null,
      awayScore: null,
      awayName: versusMatch[2].trim(),
    };
  }

  return null;
}

export function getParsedMatchTeamsWithLogos(
  input: string,
  logoMap: Map<string, string>,
) {
  const parsed = parseMatchTeams(input);

  if (!parsed) {
    return null;
  }

  return {
    ...parsed,
    homeLogo: logoMap.get(normalizeTeamName(parsed.homeName)),
    awayLogo: logoMap.get(normalizeTeamName(parsed.awayName)),
  };
}
