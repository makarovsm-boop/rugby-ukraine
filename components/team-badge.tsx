import Image from "next/image";
import { getTeamBranding } from "@/lib/team-branding";

type TeamBadgeProps = {
  name: string;
  logo?: string;
  className?: string;
  nameClassName?: string;
  size?: "sm" | "md";
};

export function TeamBadge({
  name,
  logo,
  className = "",
  nameClassName = "",
  size = "md",
}: TeamBadgeProps) {
  const branding = getTeamBranding(name);
  const image = logo ?? branding.image;
  const badgeSizeClass = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSizeClass = size === "sm" ? "text-sm" : "";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <span
        className={`relative flex ${badgeSizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 shadow-sm ${branding.bgClass}`}
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
      <span className={`${textSizeClass} ${nameClassName}`.trim()}>{name}</span>
    </span>
  );
}
