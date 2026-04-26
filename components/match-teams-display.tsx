import Link from "next/link";
import { TeamBadge } from "@/components/team-badge";

type MatchTeamsDisplayProps = {
  homeName: string;
  awayName: string;
  homeLogo?: string;
  awayLogo?: string;
  homeHref?: string;
  awayHref?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  separatorLabel?: string;
  className?: string;
  teamNameClassName?: string;
  size?: "sm" | "md";
};

export function MatchTeamsDisplay({
  homeName,
  awayName,
  homeLogo,
  awayLogo,
  homeHref,
  awayHref,
  homeScore,
  awayScore,
  separatorLabel = "vs",
  className = "",
  teamNameClassName = "",
  size = "md",
}: MatchTeamsDisplayProps) {
  const separator =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined
      ? `${homeScore}:${awayScore}`
      : separatorLabel;

  const homeBadge = (
    <TeamBadge
      name={homeName}
      logo={homeLogo}
      size={size}
      nameClassName={teamNameClassName}
    />
  );
  const awayBadge = (
    <TeamBadge
      name={awayName}
      logo={awayLogo}
      size={size}
      nameClassName={teamNameClassName}
    />
  );

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${className}`.trim()}>
      {homeHref ? (
        <Link
          href={homeHref}
          className="transition-opacity hover:opacity-85"
        >
          {homeBadge}
        </Link>
      ) : (
        homeBadge
      )}

      <span className="inline-flex w-fit items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:px-4">
        {separator}
      </span>

      {awayHref ? (
        <Link
          href={awayHref}
          className="transition-opacity hover:opacity-85"
        >
          {awayBadge}
        </Link>
      ) : (
        awayBadge
      )}
    </div>
  );
}
