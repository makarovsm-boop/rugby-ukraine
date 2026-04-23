import type { Metadata } from "next";
import Link from "next/link";
import { createPlayer, deletePlayer } from "@/app/admin/players/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin-form-field";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminImageField } from "@/components/admin-image-field";
import { AdminFormSuccess } from "@/components/admin-form-success";
import {
  getFormErrorMessage,
  getFormSuccessMessage,
} from "@/lib/admin-form-errors";
import { getAdminPlayers, getTeamsForAdminSelect } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка гравців | Rugby Ukraine",
  description: "Проста адмінка для створення та редагування гравців Rugby Ukraine.",
};

type AdminPlayersPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminPlayersPage({
  searchParams,
}: AdminPlayersPageProps) {
  await requireAdmin();
  const { error, success } = await searchParams;
  const [players, teams] = await Promise.all([
    getAdminPlayers(),
    getTeamsForAdminSelect(),
  ]);
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Гравці"
        title="Керування гравцями"
        description="Працюйте з профілями гравців, командними зв’язками та основними ігровими характеристиками."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">Новий гравець</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Профіль гравця складається з короткого summary для списків і повнішого bio
            для окремої сторінки.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createPlayer} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Ім'я та прізвище">
            <input type="text" name="name" placeholder="Олександр Бойко" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Команда">
            <select name="teamId" defaultValue="" required className={adminSelectClass}>
              <option value="" disabled>Оберіть команду</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Позиція">
            <input type="text" name="position" placeholder="Скрам-хав" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Номер" hint="Ціле число більше нуля.">
            <input type="number" name="number" min={1} placeholder="9" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Вік">
            <input type="number" name="age" min={1} placeholder="27" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Зріст">
            <input type="text" name="height" placeholder="178 см" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Вага">
            <input type="text" name="weight" placeholder="84 кг" required className={adminInputClass} />
          </AdminFormField>
          <AdminImageField folder="players" imagePlaceholder="/player-image.svg" />
          <AdminFormField label="Короткий опис" hint="Показується в картках і списках." className="md:col-span-2">
            <textarea name="summary" rows={3} placeholder="Короткий опис" required className={adminTextareaClass} />
          </AdminFormField>
          <AdminFormField label="Розширений профіль" hint="Основний текст для сторінки гравця." className="md:col-span-2">
            <textarea name="bio" rows={6} placeholder="Розширений профіль" required className={adminTextareaClass} />
          </AdminFormField>
          <button
            type="submit"
            className={`${adminPrimaryButtonClass} md:col-span-2`}
          >
            Створити гравця
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Усі гравці</h2>

        {players.map((player) => (
          <article
            key={player.id}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    #{player.number}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{player.position}</span>
                  <span className="text-slate-300">•</span>
                  <span>{player.team.name}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {player.name}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {player.summary}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Вік: {player.age}</span>
                  <span>Зріст: {player.height}</span>
                  <span>Вага: {player.weight}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/players/${player.slug}`}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                >
                  Перегляд
                </Link>
                <Link
                  href={`/admin/players/${player.slug}`}
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Редагувати
                </Link>
                <form action={deletePlayer.bind(null, player.slug)}>
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
        ))}
      </section>
    </div>
  );
}

