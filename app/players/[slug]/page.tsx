import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamBadge } from "@/components/team-badge";
import {
  getPlayerBySlug,
  getPlayers,
} from "@/lib/db";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle, siteConfig } from "@/lib/seo";

type PlayerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const players = await getPlayers();

  return players.map((player) => ({
    slug: player.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    return {
      title: buildTitle("Гравці"),
    };
  }

  const safeImage = await getSafeImagePath(player.image, "players");

  return {
    title: buildTitle(player.name),
    description: player.summary,
    alternates: {
      canonical: `/players/${player.slug}`,
    },
    openGraph: {
      title: buildTitle(player.name),
      description: player.summary,
      url: `${siteConfig.url}/players/${player.slug}`,
      type: "profile",
      images: [
        {
          url: safeImage,
        },
      ],
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const safeImage = await getSafeImagePath(player.image, "players");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/players"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До всіх гравців
      </Link>

      <article className="content-card-strong overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/7]">
          <Image
            src={safeImage}
            alt={player.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 960px"
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              #{player.number} • {player.position}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              <TeamBadge
                name={player.team.name}
                logo={player.team.image ?? undefined}
                size="sm"
                nameClassName="font-medium text-slate-700"
              />
            </span>
            <span>{player.team.country}</span>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {player.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              {player.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`/teams/${player.team.slug}`}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                <span className="inline-flex items-center gap-2">
                  Перейти до команди
                  <TeamBadge
                    name={player.team.name}
                    logo={player.team.image ?? undefined}
                    size="sm"
                    nameClassName="font-medium"
                  />
                </span>
              </Link>
              <span className="text-sm text-slate-500">
                {player.team.country} • {player.team.level}
              </span>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-4">
            <div>
              <p className="font-semibold text-slate-900">Вік</p>
              <p className="mt-2">{player.age} років</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Зріст</p>
              <p className="mt-2">{player.height}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Вага</p>
              <p className="mt-2">{player.weight}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Команда</p>
              <div className="mt-2">
                <TeamBadge
                  name={player.team.name}
                  logo={player.team.image ?? undefined}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Профіль
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Коротка характеристика
              </h2>
            </div>

            <div className="space-y-4 text-base leading-8 text-slate-700">
              <p>{player.bio}</p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
