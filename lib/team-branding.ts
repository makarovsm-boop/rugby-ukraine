type TeamBranding = {
  shortName: string;
  bgClass: string;
  textClass: string;
  image?: string;
};

const teamBrandingMap: Record<string, TeamBranding> = {
  "bath rugby": {
    shortName: "BAT",
    bgClass: "bg-slate-900",
    textClass: "text-white",
  },
  "benetton rugby": {
    shortName: "BEN",
    bgClass: "bg-emerald-700",
    textClass: "text-white",
  },
  "bordeaux bègles": {
    shortName: "UBB",
    bgClass: "bg-amber-500",
    textClass: "text-slate-950",
  },
  "bordeaux begles": {
    shortName: "UBB",
    bgClass: "bg-amber-500",
    textClass: "text-slate-950",
  },
  "bristol bears": {
    shortName: "BRI",
    bgClass: "bg-cyan-700",
    textClass: "text-white",
  },
  bulls: {
    shortName: "BUL",
    bgClass: "bg-sky-700",
    textClass: "text-white",
    image: "/team-bulls.svg",
  },
  "cardiff rugby": {
    shortName: "CAR",
    bgClass: "bg-blue-700",
    textClass: "text-white",
  },
  connacht: {
    shortName: "CON",
    bgClass: "bg-emerald-600",
    textClass: "text-white",
  },
  "connacht rugby": {
    shortName: "CON",
    bgClass: "bg-emerald-600",
    textClass: "text-white",
  },
  "dhl stormers": {
    shortName: "STO",
    bgClass: "bg-indigo-700",
    textClass: "text-white",
  },
  "dragons rfc": {
    shortName: "DRA",
    bgClass: "bg-rose-700",
    textClass: "text-white",
  },
  "edinburgh rugby": {
    shortName: "EDI",
    bgClass: "bg-sky-900",
    textClass: "text-white",
  },
  "exeter chiefs": {
    shortName: "EXE",
    bgClass: "bg-red-700",
    textClass: "text-white",
  },
  france: {
    shortName: "FRA",
    bgClass: "bg-blue-700",
    textClass: "text-white",
  },
  "fidelity securedrive lions": {
    shortName: "LIO",
    bgClass: "bg-red-600",
    textClass: "text-white",
  },
  "glasgow warriors": {
    shortName: "GLA",
    bgClass: "bg-violet-700",
    textClass: "text-white",
  },
  "gloucester rugby": {
    shortName: "GLO",
    bgClass: "bg-red-800",
    textClass: "text-white",
  },
  "harlequins": {
    shortName: "HAR",
    bgClass: "bg-emerald-700",
    textClass: "text-white",
  },
  ireland: {
    shortName: "IRE",
    bgClass: "bg-emerald-700",
    textClass: "text-white",
  },
  italy: {
    shortName: "ITA",
    bgClass: "bg-sky-700",
    textClass: "text-white",
  },
  "leinster rugby": {
    shortName: "LEI",
    bgClass: "bg-blue-700",
    textClass: "text-white",
    image: "/team-leinster.svg",
  },
  "leicester tigers": {
    shortName: "LEI",
    bgClass: "bg-green-700",
    textClass: "text-white",
  },
  "munster rugby": {
    shortName: "MUN",
    bgClass: "bg-red-700",
    textClass: "text-white",
  },
  "newcastle red bulls": {
    shortName: "NEW",
    bgClass: "bg-slate-800",
    textClass: "text-white",
  },
  "northampton saints": {
    shortName: "NOR",
    bgClass: "bg-emerald-950",
    textClass: "text-white",
  },
  ospreys: {
    shortName: "OSP",
    bgClass: "bg-black",
    textClass: "text-white",
  },
  "rc toulon": {
    shortName: "RCT",
    bgClass: "bg-rose-700",
    textClass: "text-white",
  },
  sale: {
    shortName: "SAL",
    bgClass: "bg-sky-900",
    textClass: "text-white",
  },
  "sale sharks": {
    shortName: "SAL",
    bgClass: "bg-sky-900",
    textClass: "text-white",
  },
  saracens: {
    shortName: "SAR",
    bgClass: "bg-black",
    textClass: "text-white",
  },
  scotland: {
    shortName: "SCO",
    bgClass: "bg-indigo-700",
    textClass: "text-white",
  },
  scarlets: {
    shortName: "SCA",
    bgClass: "bg-red-600",
    textClass: "text-white",
  },
  "ulster rugby": {
    shortName: "ULS",
    bgClass: "bg-red-500",
    textClass: "text-white",
  },
  wales: {
    shortName: "WAL",
    bgClass: "bg-rose-700",
    textClass: "text-white",
  },
  "vodacom bulls": {
    shortName: "BUL",
    bgClass: "bg-sky-700",
    textClass: "text-white",
    image: "/team-bulls.svg",
  },
  "zebre parma": {
    shortName: "ZEB",
    bgClass: "bg-yellow-500",
    textClass: "text-slate-950",
  },
};

function normalizeTeamName(name: string) {
  return name.trim().toLowerCase();
}

function createFallbackShortName(name: string) {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, ""))
    .filter(Boolean);

  if (words.length === 0) {
    return "TM";
  }

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getTeamBranding(name: string): TeamBranding {
  const normalized = normalizeTeamName(name);
  const exact = teamBrandingMap[normalized];

  if (exact) {
    return exact;
  }

  return {
    shortName: createFallbackShortName(name),
    bgClass: "bg-slate-200",
    textClass: "text-slate-700",
  };
}
