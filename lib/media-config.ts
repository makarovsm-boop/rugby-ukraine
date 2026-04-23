export const fallbackImageByFolder = {
  articles: "/fallback-article.svg",
  teams: "/fallback-team.svg",
  players: "/fallback-player.svg",
  championships: "/fallback-championship.svg",
} as const;

export type MediaFolder = keyof typeof fallbackImageByFolder;

function trimImagePath(value: string | null | undefined) {
  return String(value ?? "").trim();
}

export function getFallbackImagePath(folder: MediaFolder) {
  return fallbackImageByFolder[folder];
}

export function normalizeImagePath(
  value: string | null | undefined,
  folder: MediaFolder,
  siteUrl?: string,
) {
  const imagePath = trimImagePath(value);

  if (!imagePath) {
    return getFallbackImagePath(folder);
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    try {
      const url = new URL(imagePath);

      if (siteUrl && url.origin === siteUrl) {
        return url.pathname || getFallbackImagePath(folder);
      }

      return imagePath;
    } catch {
      return getFallbackImagePath(folder);
    }
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  return `/${imagePath}`;
}
