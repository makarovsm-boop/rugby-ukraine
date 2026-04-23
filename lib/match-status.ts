export const matchStatuses = ["upcoming", "live", "finished"] as const;

export type MatchStatus = (typeof matchStatuses)[number];

export function isMatchStatus(value: string): value is MatchStatus {
  return matchStatuses.includes(value as MatchStatus);
}

export function getMatchStatusLabel(status: string) {
  switch (status) {
    case "live":
      return "Наживо";
    case "finished":
      return "Завершено";
    case "upcoming":
    default:
      return "Скоро";
  }
}

export function getMatchStatusClasses(status: string) {
  switch (status) {
    case "live":
      return "border border-rose-200 bg-rose-50 text-rose-700";
    case "finished":
      return "border border-slate-200 bg-slate-100 text-slate-700";
    case "upcoming":
    default:
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export function getMatchStatusSortOrder(status: string) {
  switch (status) {
    case "live":
      return 0;
    case "upcoming":
      return 1;
    case "finished":
    default:
      return 2;
  }
}
