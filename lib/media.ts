import { access } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import {
  getFallbackImagePath,
  normalizeImagePath,
} from "@/lib/media-config";
import { siteConfig } from "@/lib/seo";
import type { MediaFolder } from "@/lib/media-config";

const publicFileExists = cache(async (relativePath: string) => {
  const normalizedPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
});

export async function getSafeImagePath(
  value: string | null | undefined,
  folder: MediaFolder,
) {
  const normalizedPath = normalizeImagePath(value, folder, siteConfig.url);

  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    return normalizedPath;
  }

  const fallbackPath = getFallbackImagePath(folder);

  if (await publicFileExists(normalizedPath)) {
    return normalizedPath;
  }

  return fallbackPath;
}
