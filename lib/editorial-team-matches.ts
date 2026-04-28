import { championships } from "@/lib/championship-data";
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
