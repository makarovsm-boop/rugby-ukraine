import {
  championships as championshipOverrides,
  getChampionshipCanonicalSlug,
} from "@/lib/championship-data";
import { buildTeamLogoMap, getParsedMatchTeamsWithLogos } from "@/lib/match-teams";

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

export type EditorialMatchCard = {
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

function normalizeMatchToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

export function buildEditorialMatchSignature(input: {
  championshipSlug: string;
  round: string;
  homeName: string;
  awayName: string;
}) {
  return [
    normalizeMatchToken(input.championshipSlug),
    normalizeMatchToken(input.round),
    normalizeMatchToken(input.homeName),
    normalizeMatchToken(input.awayName),
  ].join("::");
}

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

export function getEditorialMatchCards() {
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
        const hasScore =
          parsedTeams?.homeScore !== null &&
          parsedTeams?.homeScore !== undefined &&
          parsedTeams?.awayScore !== null &&
          parsedTeams?.awayScore !== undefined;
        const status = lowerRound.includes("наживо")
          ? "live"
          : hasScore
            ? "finished"
            : lowerRound.includes("анонс") || lowerRound.includes("півфінал")
              ? "upcoming"
              : "finished";
        const championshipSlug = getChampionshipCanonicalSlug({
          slug: championship.slug,
          title: championship.title,
        });

        return {
          id: [
            championshipSlug,
            match.round,
            match.teams,
            match.date,
            match.location,
          ].join("::"),
          championshipTitle: championship.title,
          championshipSlug,
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
