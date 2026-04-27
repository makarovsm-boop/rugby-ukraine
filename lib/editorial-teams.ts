import { championships as championshipOverrides } from "@/lib/championship-data";
import { parseMatchTeams } from "@/lib/match-teams";

export type EditorialTeam = {
  id: string;
  name: string;
  short: string;
  country: string;
  level: string;
  stadium: string;
  description: string;
  image: string;
  sources: string[];
};

function normalizeTeamName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

function buildTeamShort(name: string) {
  const words = name
    .replace(/[^a-z0-9а-яіїєґ\s]+/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const teamCountryOverrides: Record<string, string> = {
  "bath rugby": "Англія",
  "bedford blues": "Англія",
  "benetton rugby": "Італія",
  "bristol bears": "Англія",
  "bulls": "Південна Африка",
  "cardiff rugby": "Уельс",
  "connacht rugby": "Ірландія",
  "dhl stormers": "Південна Африка",
  "dragons rfc": "Уельс",
  "edinburgh rugby": "Шотландія",
  "england": "Англія",
  "exeter chiefs": "Англія",
  "fidelity securedrive lions": "Південна Африка",
  "fiji": "Фіджі",
  "france": "Франція",
  "georgia": "Грузія",
  "glasgow warriors": "Шотландія",
  "gloucester rugby": "Англія",
  "harlequins": "Англія",
  "hollywoodbets sharks": "Південна Африка",
  "ireland": "Ірландія",
  "italy": "Італія",
  "japan": "Японія",
  "leinster rugby": "Ірландія",
  "leicester tigers": "Англія",
  "munster rugby": "Ірландія",
  "new zealand": "Нова Зеландія",
  "northampton saints": "Англія",
  "ospreys": "Уельс",
  "portugal": "Португалія",
  "rc toulon": "Франція",
  "romania": "Румунія",
  "sale sharks": "Англія",
  "saracens": "Англія",
  "scarlets": "Уельс",
  "scotland": "Шотландія",
  "south africa": "Південна Африка",
  "spain": "Іспанія",
  "ulster rugby": "Ірландія",
  "union bordeaux begles": "Франція",
  "vodacom bulls": "Південна Африка",
  "wales": "Уельс",
  "zebre parma": "Італія",
};

function inferCountry(name: string, fallback: string) {
  return teamCountryOverrides[normalizeTeamName(name)] ?? fallback;
}

export function getEditorialTeams() {
  const teams = new Map<string, EditorialTeam>();

  for (const championship of championshipOverrides) {
    const defaultLevel = championship.format === "Збірні" ? "Збірна" : "Клуб";
    const fallbackCountry =
      championship.region === "Європа" ||
      championship.region === "Міжнародні" ||
      championship.region === "Світ"
        ? "Потребує уточнення"
        : championship.region;

    for (const standing of championship.standings) {
      const key = normalizeTeamName(standing.name);
      if (!key) {
        continue;
      }

      const existing = teams.get(key);
      teams.set(key, {
        id: key,
        name: standing.name,
        short: existing?.short ?? buildTeamShort(standing.name),
        country: existing?.country ?? inferCountry(standing.name, fallbackCountry),
        level: existing?.level ?? defaultLevel,
        stadium: existing?.stadium ?? "Потребує уточнення",
        description:
          existing?.description ??
          `Редакційно додана ${defaultLevel.toLowerCase()} для матеріалів і матчів турніру ${championship.title}.`,
        image: standing.logo ?? existing?.image ?? "/team-image.svg",
        sources: Array.from(
          new Set([...(existing?.sources ?? []), championship.title]),
        ),
      });
    }

    for (const match of championship.matches) {
      const parsed = parseMatchTeams(match.teams);
      if (!parsed) {
        continue;
      }

      for (const teamName of [parsed.homeName, parsed.awayName]) {
        const key = normalizeTeamName(teamName);
        if (!key) {
          continue;
        }

        const existing = teams.get(key);
        if (existing) {
          existing.sources = Array.from(
            new Set([...existing.sources, championship.title]),
          );
          continue;
        }

        teams.set(key, {
          id: key,
          name: teamName,
          short: buildTeamShort(teamName),
          country: inferCountry(teamName, fallbackCountry),
          level: defaultLevel,
          stadium: "Потребує уточнення",
          description: `Редакційно додана ${defaultLevel.toLowerCase()} для матеріалів і матчів турніру ${championship.title}.`,
          image: "/team-image.svg",
          sources: [championship.title],
        });
      }
    }
  }

  return [...teams.values()].sort((a, b) => a.name.localeCompare(b.name));
}
