import { championships } from "@/lib/championship-data";
import { getEditorialMatchCards } from "@/lib/editorial-matches";
import { parseMatchTeams } from "@/lib/match-teams";

function normalizeTeamName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

export function getEditorialTeamMatchMentions(teamName: string) {
  const target = normalizeTeamName(teamName);
  let count = 0;

  for (const championship of championships) {
    for (const match of championship.matches) {
      const parsed = parseMatchTeams(match.teams);
      if (!parsed) {
        continue;
      }

      const isMentioned =
        normalizeTeamName(parsed.homeName) === target ||
        normalizeTeamName(parsed.awayName) === target;

      if (isMentioned) {
        count += 1;
      }
    }
  }

  return count;
}

export type EditorialTeamUpcomingMatch = {
  opponentName: string;
  date: Date;
  championshipTitle: string;
  round: string;
};

export function getEditorialUpcomingMatchesForTeam(
  teamName: string,
): EditorialTeamUpcomingMatch[] {
  const target = normalizeTeamName(teamName);
  const now = Date.now();

  return getEditorialMatchCards()
    .filter((match) => {
      if (!match.parsedTeams || !match.parsedDate) {
        return false;
      }

      const home = normalizeTeamName(match.parsedTeams.homeName);
      const away = normalizeTeamName(match.parsedTeams.awayName);
      const isMentioned = home === target || away === target;

      if (!isMentioned) {
        return false;
      }

      if (match.status === "finished") {
        return false;
      }

      return match.parsedDate.getTime() >= now - 2 * 60 * 60 * 1000;
    })
    .map((match) => {
      const isHome = normalizeTeamName(match.parsedTeams!.homeName) === target;

      return {
        opponentName: isHome
          ? match.parsedTeams!.awayName
          : match.parsedTeams!.homeName,
        date: match.parsedDate!,
        championshipTitle: match.championshipTitle,
        round: match.round,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
