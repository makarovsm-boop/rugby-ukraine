import Image from "next/image";
import { getTeamBranding } from "@/lib/team-branding";

type TeamBadgeProps = {
  name: string;
};

export function TeamBadge({ name }: TeamBadgeProps) {
  const branding = getTeamBranding(name);

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 shadow-sm ${branding.bgClass}`}
        aria-hidden="true"
      >
        {branding.image ? (
          <Image
            src={branding.image}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${branding.textClass}`}>
            {branding.shortName}
          </span>
        )}
      </span>
      <span>{name}</span>
    </span>
  );
}
