import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMatch, updateMatch } from "@/app/admin/matches/actions";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminPageHeader } from "@/components/admin-page-header";
import { getFormErrorMessage } from "@/lib/admin-form-errors";
import {
  getAdminMatchById,
  getChampionshipsForAdminSelect,
  getTeamsForAdminSelect,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getMatchStatusLabel, matchStatuses } from "@/lib/match-status";
import { buildTitle } from "@/lib/seo";

type AdminEditMatchPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminEditMatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getAdminMatchById(id);

  return {
    title: buildTitle(
      match
        ? `Редагування: ${match.homeTeam.name} vs ${match.awayTeam.name}`
        : "Редагування матчу",
    ),
  };
}

export default async function AdminEditMatchPage({
  params,
  searchParams,
}: AdminEditMatchPageProps) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const [match, championships, teams] = await Promise.all([
    getAdminMatchById(id),
    getChampionshipsForAdminSelect(),
    getTeamsForAdminSelect(),
  ]);
  const errorMessage = getFormErrorMessage(error);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <Link
        href="/admin/matches"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До списку матчів
      </Link>

      <AdminPageHeader
        eyebrow="Матчі"
        title="Редагування матчу"
        description="Оновіть турнір, статус, дату проведення, місце і підсумковий рахунок матчу."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <AdminFormError message={errorMessage} />

        <form
          action={updateMatch.bind(null, match.id)}
          className="grid gap-4 md:grid-cols-2"
        >
          <select
            name="championshipId"
            defaultValue={match.championshipId}
            required
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          >
            {championships.map((championship) => (
              <option key={championship.id} value={championship.id}>
                {championship.title} ({championship.season})
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={match.status}
            required
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          >
            {matchStatuses.map((status) => (
              <option key={status} value={status}>
                {getMatchStatusLabel(status)}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="round"
            defaultValue={match.round}
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />

          <select
            name="homeTeamId"
            defaultValue={match.homeTeamId}
            required
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            name="awayTeamId"
            defaultValue={match.awayTeamId}
            required
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="date"
            defaultValue={match.date.toISOString().slice(0, 16)}
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />

          <input
            type="text"
            name="location"
            defaultValue={match.location}
            required
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />

          <input
            type="number"
            name="homeScore"
            min={0}
            defaultValue={match.homeScore ?? ""}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />

          <input
            type="number"
            name="awayScore"
            min={0}
            defaultValue={match.awayScore ?? ""}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--accent)]"
          />

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              Зберегти зміни
            </button>
            <button
              formAction={deleteMatch.bind(null, match.id)}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
            >
              Видалити матч
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
