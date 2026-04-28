import { createSlug } from "@/lib/admin";

const BATH_CMS_BASE_URL = "https://article-cms-api.incrowdsports.com";
const BATH_CLIENT_ID = "BATHRUGBY";
const BATH_MEN_CATEGORY_ID = "42c4ae6b-2e40-40f5-9212-c404d44b11d7";
const BATH_UTILITY_CATEGORY_ID = "5e1759c1-5162-4895-8e8b-8a5d4b1c7e3e";
const BATH_PLAYERS_CATEGORY_ID = "c5f185af-b2f1-4430-9a4f-c49e55821ad4";

type BathCmsArticle = {
  categories?: Array<{ id?: string; text?: string }>;
  heroMedia?: {
    title?: string;
    content?: {
      image?: string;
      imageThumbnail?: string;
    };
  };
  content?: Array<{
    contentType?: string;
    customContent?: {
      playerFirstName_string?: string;
      playerLastName_string?: string;
      position_select?: string;
      dateOfBirth_string?: string;
      height_string?: string;
      weight_string?: string;
    };
  }>;
};

export type BathApiPlayer = {
  slug: string;
  name: string;
  position: string;
  image: string;
  age: number;
  height: string;
  weight: string;
};

function parseAgeFromDateOfBirth(value?: string) {
  if (!value) {
    return 25;
  }

  const parts = value.split("/");
  if (parts.length !== 3) {
    return 25;
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  if (!day || month < 0 || !year) {
    return 25;
  }

  const birthDate = new Date(year, month, day);
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() &&
      now.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age > 0 ? age : 25;
}

function isMenPlayerArticle(article: BathCmsArticle) {
  const categoryIds = new Set((article.categories ?? []).map((item) => item.id));

  return (
    categoryIds.has(BATH_MEN_CATEGORY_ID) &&
    categoryIds.has(BATH_PLAYERS_CATEGORY_ID)
  );
}

export async function fetchBathMenPlayersFromApi(): Promise<BathApiPlayer[]> {
  const query = encodeURIComponent(
    `categories.id:${BATH_MEN_CATEGORY_ID} AND categories.id:${BATH_UTILITY_CATEGORY_ID}`,
  );
  const response = await fetch(
    `${BATH_CMS_BASE_URL}/v2/articles/search?clientId=${BATH_CLIENT_ID}&singlePage=true&query=${query}&size=100`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Bath API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: { articles?: BathCmsArticle[] };
  };
  const articles = payload.data?.articles ?? [];

  const players = articles
    .filter(isMenPlayerArticle)
    .map((article) => {
      const custom = article.content?.find(
        (item) => item.contentType === "CUSTOM",
      )?.customContent;
      const firstName = custom?.playerFirstName_string?.trim() ?? "";
      const lastName = custom?.playerLastName_string?.trim() ?? "";
      const name = `${firstName} ${lastName}`.trim();
      const image =
        article.heroMedia?.content?.imageThumbnail ??
        article.heroMedia?.content?.image ??
        "";

      if (!name || !image) {
        return null;
      }

      return {
        slug: createSlug(name),
        name,
        position: custom?.position_select?.trim() || "Гравець",
        image,
        age: parseAgeFromDateOfBirth(custom?.dateOfBirth_string),
        height: custom?.height_string?.trim() || "Н/Д",
        weight: custom?.weight_string?.trim() || "Н/Д",
      } satisfies BathApiPlayer;
    })
    .filter((item): item is BathApiPlayer => Boolean(item));

  const uniqueBySlug = new Map<string, BathApiPlayer>();
  for (const player of players) {
    uniqueBySlug.set(player.slug, player);
  }

  return [...uniqueBySlug.values()];
}
