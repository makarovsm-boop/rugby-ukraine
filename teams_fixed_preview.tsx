import type { Metadata } from "next";
import Link from "next/link";
import { createTeam, deleteTeam } from "@/app/admin/teams/actions";
import { AdminFormError } from "@/components/admin-form-error";
import { getFormErrorMessage } from "@/lib/admin-form-errors";
import { getAdminTeams } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка команд | Rugby Ukraine",
  description: "Проста адмінка для створення та редагування команд Rugby Ukraine.",
};

type AdminTeamsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminTeamsPage({ searchParams }: AdminTeamsPageProps) {
  await requireAdmin();
  const { error } = await searchParams;
  const teams = await getAdminTeams();
  const errorMessage = getFormErrorMessage(error);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/70 bg-[var(--surface)] px-6 py-10 shadow-[0_20px_80px_rgba(11,31,58,0.08)] sm:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Адмінка
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Керування командами
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Тут можна створювати нові команди та редагувати наявні записи з Prisma.
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">Нова команда</h2>
        </div>

        <AdminFormError message={errorMessage} />

        <form action={createTeam} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Назва"
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
          <input
            type="text"
            name="short"
            placeholder="Коротка назва"
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm uppercase text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
          <input
            type="text"
            name="country"
            placeholder="Країна"
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
          <input
            type="text"
            name="level"
            placeholder="Рівень: Клуб або Збірна"
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />
          <input
            type="text"
            name="stadium"
            placeholder="Домашня арена"
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)] md:col-span-2"
          />
          <input
            type="text"
            name="image"
            placeholder="/team-image.svg або залиште порожнім"
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)] md:col-span-2"
          />
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white md:col-span-2"
          />
          <textarea
            name="description"
            rows={5}
            placeholder="Опис команди"
            required
            className="w-full rounded-[1.25rem] border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)] md:col-span-2"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)] md:col-span-2"
          >
            Створити команду
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Усі команди</h2>

        {teams.map((team) => {
          const matchesCount = team.homeMatches.length + team.awayMatches.length;

          return (
            <article
              key={team.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                      {team.country}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{team.short}</span>
                    <span className="text-slate-300">•</span>
                    <span>{team.level}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {team.name}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {team.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>Арена: {team.stadium}</span>
                    <span>Гравців: {team.players.length}</span>
                    <span>Матчів: {matchesCount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/teams/${team.slug}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                  >
                    Перегляд
                  </Link>
                  <Link
                    href={`/admin/teams/${team.slug}`}
                    className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Редагувати
                  </Link>
                  <form action={deleteTeam.bind(null, team.slug)}>
                    <button
                      type="submit"
                      className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
                    >
                      Видалити
                    </button>
                  </form>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

