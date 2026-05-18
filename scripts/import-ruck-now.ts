import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { getPrismaClientOptions } from "@/lib/prisma-adapter";

function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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

async function main() {
  const url = "https://www.ruck.co.uk/prem-rugby-team-of-the-week-round-16/";
  const response = await fetch(url, {
    headers: {
      "User-Agent": "UkrainianRuggersBot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Cannot fetch article: ${response.status}`);
  }

  const html = await response.text();
  const titleRaw =
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ??
    "RUCK Rugby News";
  const image =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ??
    "/news-image.svg";

  const titleEn = decode(stripHtml(titleRaw)).replace(/\s*\|\s*RUCK.*$/i, "").trim();
  const titleUk = "Команда тижня PREM Rugby: підсумок 16-го туру";

  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => decode(stripHtml(match[1])))
    .filter((line) => line.length > 90)
    .slice(0, 6);

  const excerpt =
    "Редакційний огляд 16-го туру PREM Rugby: ключові виконавці раунду, найяскравіші індивідуальні виступи та короткі висновки за підсумками вікенду.";

  const content = [
    "Матеріал підготовлено редакційно українською мовою на основі публікації RUCK.",
    `Оригінальний заголовок: ${titleEn}.`,
    "Нижче — короткий адаптований огляд ключових акцентів туру без дослівного копіювання.",
    "У 16-му турі PREM Rugby автори відзначили найефективніших гравців за позиціями та впливом на результат матчів.",
    "До символічної команди потрапили виконавці, які поєднали стабільну оборону, якісну роботу в контакті та вирішальні дії в атаці.",
    "Окремий фокус зроблено на гравцях, що визначали темп гри та приймали правильні рішення у ключові відрізки зустрічей.",
    paragraphs.length ? `Фактчек по джерелу: ${paragraphs[0]}` : "",
    `Джерело: ${url}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
  const slug = createSlug(`${titleUk}-ruck-${hash}`) || `ruck-${hash}`;

  const prisma = new PrismaClient(getPrismaClientOptions());
  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    console.log(`SKIP_EXISTS ${slug}`);
    await prisma.$disconnect();
    return;
  }

  const author = await prisma.user.findFirst({
    where: { role: { in: ["ADMIN", "EDITOR"] } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!author) {
    throw new Error("No ADMIN/EDITOR user found");
  }

  await prisma.article.create({
    data: {
      id: crypto.randomUUID(),
      slug,
      title: titleUk,
      excerpt,
      content,
      image,
      date: new Date(),
      tags: ["ruck", "premiership rugby", "команда туру"],
      published: true,
      authorId: author.id,
    },
  });

  console.log(`CREATED ${slug}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
