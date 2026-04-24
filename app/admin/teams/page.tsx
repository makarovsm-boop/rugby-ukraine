import type { Metadata } from "next";
import Link from "next/link";
import { createTeam, deleteTeam } from "@/app/admin/teams/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin-form-field";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminImageField } from "@/components/admin-image-field";
import { AdminFormSuccess } from "@/components/admin-form-success";
import {
  getFormErrorMessage,
  getFormSuccessMessage,
} from "@/lib/admin-form-errors";
import { getAdminTeams } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка команд | Rugby Ukraine",
  description: "Проста адмінка для створення та редагування команд Rugby Ukraine.",
};

type AdminTeamsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminTeamsPage({ searchParams }: AdminTeamsPageProps) {
  await requireAdmin();
  const { error, success } = await searchParams;
  const teams = await getAdminTeams();
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Команди"
        title="Керування командами"
        description="Оновлюйте базові дані клубів і збірних, стежте за наповненням складів та пов’язаних матчів."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">Нова команда</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Заповніть основну інформацію про збірну або клуб. Коротка назва потрібна
            для списків і компактних блоків.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createTeam} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Назва команди">
            <input type="text" name="name" placeholder="Наприклад: Збірна України" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Коротка назва" hint="2–4 символи для списків і скорочень.">
            <input type="text" name="short" placeholder="UA" required className={`${adminInputClass} uppercase`} />
          </AdminFormField>
          <AdminFormField label="Країна">
            <input type="text" name="country" placeholder="Україна" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Рівень" hint="Наприклад: Клуб або Збірна.">
            <input type="text" name="level" placeholder="Збірна" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Домашня арена" className="md:col-span-2">
            <input type="text" name="stadium" placeholder="Львів, стадіон «Скіф»" required className={adminInputClass} />
          </AdminFormField>
          <AdminImageField folder="teams" imagePlaceholder="/team-image.svg" />
          <AdminFormField label="Опис команди" hint="Коротко: стиль гри, статус і контекст для читача." className="md:col-span-2">
            <textarea name="description" rows={5} placeholder="Опис команди" required className={adminTextareaClass} />
          </AdminFormField>
          <button
            type="submit"
            className={`${adminPrimaryButtonClass} md:col-span-2`}
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
                    className="dark-pill-button inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
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

