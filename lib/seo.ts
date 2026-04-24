const defaultSiteUrl = "http://localhost:3000";

function normalizeSiteUrl(url?: string) {
  return url?.replace(/\/$/, "") || defaultSiteUrl;
}

export const siteConfig = {
  name: "Rugby Ukraine",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    "Український MVP сайту про регбі: новини, чемпіонати, команди, гравці та матеріали для новачків.",
  ogImage: "/og-default.svg",
  socialLinks: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
    discord: process.env.NEXT_PUBLIC_DISCORD_URL?.trim() || "",
  },
};

export function buildTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.name;
}
