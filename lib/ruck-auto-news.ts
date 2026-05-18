import { createHash, randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

const RUCK_FEED_URL = "https://www.ruck.co.uk/category/rugby-news/feed/";

type FeedItem = {
  title: string;
  link: string;
  pubDate: Date;
  excerpt: string;
  image: string | null;
};

type ImportedNewsResult = {
  status: "created" | "skipped";
  reason: string;
  slug?: string;
};

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickFirst(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXmlEntities(match[1]) : "";
}

function parseRssItems(xml: string): FeedItem[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  return itemMatches
    .map((match) => {
      const itemXml = match[1];
      const title = pickFirst(itemXml, "title");
      const link = pickFirst(itemXml, "link");
      const pubDateRaw = pickFirst(itemXml, "pubDate");
      const excerptRaw =
        pickFirst(itemXml, "description") || pickFirst(itemXml, "content:encoded");

      const mediaMatch = itemXml.match(
        /<media:content[^>]*url="([^"]+)"[^>]*>/i,
      );
      const enclosureMatch = itemXml.match(
        /<enclosure[^>]*url="([^"]+)"[^>]*>/i,
      );

      const pubDate = new Date(pubDateRaw);
      if (!title || !link || Number.isNaN(pubDate.getTime())) {
        return null;
      }

      return {
        title,
        link,
        pubDate,
        excerpt: stripHtml(excerptRaw),
        image: mediaMatch?.[1] ?? enclosureMatch?.[1] ?? null,
      } satisfies FeedItem;
    })
    .filter((item): item is FeedItem => item !== null);
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitSentences(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function truncate(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}…`;
}

async function translateToUkrainian(text: string) {
  const normalized = text.trim();
  if (!normalized) {
    return normalized;
  }

  const endpoint = process.env.RUCK_TRANSLATE_API_URL?.trim();
  if (!endpoint) {
    return normalized;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: normalized,
        source: "en",
        target: "uk",
        format: "text",
        api_key: process.env.RUCK_TRANSLATE_API_KEY?.trim() || undefined,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return normalized;
    }

    const payload = (await response.json()) as { translatedText?: string };
    return payload.translatedText?.trim() || normalized;
  } catch {
    return normalized;
  }
}

async function rewriteArticleToUkrainian(articleUrl: string, fallbackExcerpt: string) {
  const pageResponse = await fetch(articleUrl, {
    headers: {
      "User-Agent": "UkrainianRuggersBot/1.0 (+https://rugby-ukraine.vercel.app)",
    },
    cache: "no-store",
  });

  if (!pageResponse.ok) {
    const localizedExcerpt = await translateToUkrainian(fallbackExcerpt);
    return {
      excerpt: localizedExcerpt,
      content: [
        localizedExcerpt || "Короткий огляд матеріалу підготовано автоматично.",
        "Оригінальний матеріал доступний за посиланням у джерелі.",
      ].join("\n\n"),
      image: "",
    };
  }

  const html = await pageResponse.text();
  const ogImage =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i)?.[1] ??
    "";

  const paragraphMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const rawParagraphs = paragraphMatches
    .map((match) => stripHtml(match[1]))
    .filter((line) => line.length >= 70)
    .slice(0, 7);

  const translatedParagraphs: string[] = [];
  for (const paragraph of rawParagraphs) {
    const translated = await translateToUkrainian(paragraph);
    translatedParagraphs.push(translated);
  }

  const excerptSource =
    translatedParagraphs[0] ||
    (await translateToUkrainian(fallbackExcerpt)) ||
    "Оновлення міжнародних регбійних новин.";
  const excerpt = truncate(excerptSource, 220);

  const contentBlocks = [
    "Матеріал підготовлено автоматично на основі публікації RUCK. Це адаптований український огляд ключових фактів.",
    ...translatedParagraphs.slice(0, 6),
  ];

  return {
    excerpt,
    content: contentBlocks.filter(Boolean).join("\n\n"),
    image: ogImage,
  };
}

async function pickAuthorId() {
  const admin = await prisma.user.findFirst({
    where: {
      role: { in: ["ADMIN", "EDITOR"] },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!admin) {
    throw new Error("Не знайдено користувача ADMIN/EDITOR для авто-публікації новин.");
  }

  return admin.id;
}

export async function importLatestRuckNews(): Promise<ImportedNewsResult> {
  if (process.env.RUCK_AUTO_NEWS_ENABLED?.trim() !== "true") {
    return {
      status: "skipped",
      reason: "RUCK_AUTO_NEWS_ENABLED != true",
    };
  }

  const feedResponse = await fetch(RUCK_FEED_URL, {
    headers: {
      "User-Agent": "UkrainianRuggersBot/1.0 (+https://rugby-ukraine.vercel.app)",
    },
    cache: "no-store",
  });

  if (!feedResponse.ok) {
    throw new Error(`Feed request failed: ${feedResponse.status}`);
  }

  const feedXml = await feedResponse.text();
  const items = parseRssItems(feedXml);
  const latest = items[0];

  if (!latest) {
    return {
      status: "skipped",
      reason: "Feed has no items",
    };
  }

  const sourceHash = createHash("sha1").update(latest.link).digest("hex").slice(0, 12);
  const slugBase = createSlug(`${latest.title}-ruck-${sourceHash}`) || `ruck-${sourceHash}`;

  const existing = await prisma.article.findUnique({
    where: { slug: slugBase },
    select: { slug: true },
  });

  if (existing) {
    return {
      status: "skipped",
      reason: "Latest item already imported",
      slug: existing.slug,
    };
  }

  const localizedTitle = await translateToUkrainian(latest.title);
  const rewritten = await rewriteArticleToUkrainian(latest.link, latest.excerpt);
  const authorId = await pickAuthorId();
  const image = rewritten.image || latest.image || "/news-image.svg";

  await prisma.article.create({
    data: {
      id: randomUUID(),
      slug: slugBase,
      title: truncate(localizedTitle, 180),
      excerpt: rewritten.excerpt,
      content: `${rewritten.content}\n\nДжерело: ${latest.link}`,
      image,
      date: latest.pubDate,
      tags: ["ruck", "міжнародні новини", "огляд"],
      published: true,
      authorId,
    },
  });

  return {
    status: "created",
    reason: "Imported latest RUCK article",
    slug: slugBase,
  };
}

export async function importRuckArticleByUrl(articleUrl: string): Promise<ImportedNewsResult> {
  const normalizedUrl = articleUrl.trim();
  if (!normalizedUrl) {
    return {
      status: "skipped",
      reason: "Empty URL",
    };
  }

  const sourceHash = createHash("sha1").update(normalizedUrl).digest("hex").slice(0, 12);

  const existingByHash = await prisma.article.findFirst({
    where: {
      slug: { contains: sourceHash },
    },
    select: { slug: true },
  });

  if (existingByHash) {
    return {
      status: "skipped",
      reason: "Article already imported",
      slug: existingByHash.slug,
    };
  }

  const pageResponse = await fetch(normalizedUrl, {
    headers: {
      "User-Agent": "UkrainianRuggersBot/1.0 (+https://rugby-ukraine.vercel.app)",
    },
    cache: "no-store",
  });

  if (!pageResponse.ok) {
    throw new Error(`Article request failed: ${pageResponse.status}`);
  }

  const html = await pageResponse.text();
  const titleRaw =
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ??
    "Ruck Rugby News";
  const title = decodeXmlEntities(stripHtml(titleRaw).replace(/\s*\|\s*RUCK.*$/i, ""));

  const excerptRaw =
    html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1] ??
    "";
  const excerptFallback = decodeXmlEntities(stripHtml(excerptRaw));

  const rewritten = await rewriteArticleToUkrainian(normalizedUrl, excerptFallback);
  const localizedTitle = await translateToUkrainian(title);
  const authorId = await pickAuthorId();
  const slugBase = createSlug(`${localizedTitle}-ruck-${sourceHash}`) || `ruck-${sourceHash}`;

  await prisma.article.create({
    data: {
      id: randomUUID(),
      slug: slugBase,
      title: truncate(localizedTitle, 180),
      excerpt: rewritten.excerpt,
      content: `${rewritten.content}\n\nДжерело: ${normalizedUrl}`,
      image: rewritten.image || "/news-image.svg",
      date: new Date(),
      tags: ["ruck", "premiership rugby", "команда туру"],
      published: true,
      authorId,
    },
  });

  return {
    status: "created",
    reason: "Imported by URL",
    slug: slugBase,
  };
}
