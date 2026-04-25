import Image from "next/image";
import { getTeamBranding } from "@/lib/team-branding";

type TeamBadgeProps = {
  name: string;
  logo?: string;
};

export function TeamBadge({ name, logo }: TeamBadgeProps) {
  const branding = getTeamBranding(name);
  const image = logo ?? branding.image;

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 shadow-sm ${branding.bgClass}`}
        aria-hidden="true"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-contain bg-white p-1"
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
