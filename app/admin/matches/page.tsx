import type { Metadata } from "next";
import Link from "next/link";
import { createMatch, deleteMatch } from "@/app/admin/matches/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSelectClass,
} from "@/components/admin-form-field";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminFormSuccess } from "@/components/admin-form-success";
import {
  getFormErrorMessage,
  getFormSuccessMessage,
} from "@/lib/admin-form-errors";
import {
  formatDateTime,
  getAdminMatches,
  getChampionshipsForAdminSelect,
  getTeamsForAdminSelect,
} from "@/lib/db";
import {
  getMatchStatusClasses,
  getMatchStatusLabel,
  matchStatuses,
} from "@/lib/match-status";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка матчів | Rugby Ukraine",
  description:
    "Проста адмінка для створення та редагування матчів Rugby Ukraine.",
};

type AdminMatchesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminMatchesPage({
  searchParams,
}: AdminMatchesPageProps) {
  await requireAdmin();
  const { error, success } = await searchParams;
  const [matches, championships, teams] = await Promise.all([
    getAdminMatches(),
    getChampionshipsForAdminSelect(),
    getTeamsForAdminSelect(),
  ]);
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Матчі"
        title="Керування матчами"
        description="Оновлюйте календар, результати, статуси й прив’язки матчів до турнірів та команд."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">Новий матч</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Укажіть турнір, команди, статус і дату. Для live/finished потрібно
            вказувати обидва рахунки.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createMatch} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Чемпіонат">
            <select name="championshipId" defaultValue="" required className={adminSelectClass}>
              <option value="" disabled>Оберіть чемпіонат</option>
              {championships.map((championship) => (
                <option key={championship.id} value={championship.id}>
                  {championship.title} ({championship.season})
                </option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Статус матчу">
            <select name="status" defaultValue="upcoming" required className={adminSelectClass}>
              {matchStatuses.map((status) => (
                <option key={status} value={status}>
                  {getMatchStatusLabel(status)}
                </option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Тур або стадія">
            <input type="text" name="round" placeholder="5 тур / Півфінал" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Домашня команда">
            <select name="homeTeamId" defaultValue="" required className={adminSelectClass}>
              <option value="" disabled>Домашня команда</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Гостьова команда">
            <select name="awayTeamId" defaultValue="" required className={adminSelectClass}>
              <option value="" disabled>Гостьова команда</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Дата й час матчу">
            <input type="datetime-local" name="date" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Місце проведення">
            <input type="text" name="location" placeholder="Львів, стадіон «Скіф»" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Рахунок господарів" hint="Залиште порожнім для upcoming.">
            <input type="number" name="homeScore" min={0} placeholder="14" className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Рахунок гостей" hint="Для live/finished заповніть обидва поля.">
            <input type="number" name="awayScore" min={0} placeholder="10" className={adminInputClass} />
          </AdminFormField>

          <button
            type="submit"
            className={`${adminPrimaryButtonClass} md:col-span-2`}
          >
            Створити матч
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Усі матчі</h2>

        {matches.map((match) => (
          <article
            key={match.id}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    {match.championship.title}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{match.round}</span>
                  <span className="text-slate-300">•</span>
                  <span>{formatDateTime(match.date)}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStatusClasses(match.status)}`}
                  >
                    {getMatchStatusLabel(match.status)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {match.location}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>
                    Рахунок:{" "}
                    {match.homeScore !== null && match.awayScore !== null
                      ? `${match.homeScore}:${match.awayScore}`
                      : "ще не вказано"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/matches/${match.id}`}
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Редагувати
                </Link>
                <form action={deleteMatch.bind(null, match.id)}>
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
