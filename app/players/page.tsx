import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TeamBadge } from "@/components/team-badge";
import { PageIntro } from "@/components/page-intro";
import { getPlayers } from "@/lib/db";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Гравці"),
  description: "Профілі гравців з регбі на Rugby Ukraine.",
  alternates: {
    canonical: "/players",
  },
};

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Гравці"
        description="Каталог гравців із короткими редакційними профілями: позиція, базові антропометричні дані, команда і стисла характеристика ролі на полі."
      />

      <section className="content-card rounded-[1.5rem] p-5 text-sm leading-7 text-slate-600">
        <p>
          Профілі гравців на сайті мають довідковий характер. Це не офіційні
          картки клубів і не скаутські звіти, а короткі редакційні описи, які
          допомагають читачу швидше зрозуміти, хто є хто.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {await Promise.all(players.map(async (player, index) => {
          const safeImage = await getSafeImagePath(player.image, "players");

          return (
            <article
              key={player.slug}
              className="content-card overflow-hidden rounded-[1.5rem]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={safeImage}
                  alt={player.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    #{player.number} • {player.position}
                  </span>
                  <span className="text-sm text-slate-500">{player.team.country}</span>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold leading-tight text-slate-950">
                    {player.name}
                  </h2>
                  <div className="mt-2 text-[var(--accent)]">
                    <TeamBadge
                      name={player.team.name}
                      logo={player.team.image ?? undefined}
                      size="sm"
                      nameClassName="text-sm font-medium text-[var(--accent)]"
                    />
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {player.summary}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-[1.25rem] bg-slate-50 p-4 text-center text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">{player.age}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Вік
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{player.height}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Зріст
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{player.weight}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Вага
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/players/${player.slug}`}
                    className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                  >
                    Відкрити профіль
                  </Link>
                  <Link
                    href={`/teams/${player.team.slug}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                  >
                    Команда
                  </Link>
                </div>
              </div>
            </article>
          );
        }))}
      </section>
    </div>
  );
}
