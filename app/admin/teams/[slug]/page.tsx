import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteTeam, updateTeam } from "@/app/admin/teams/actions";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminImageField } from "@/components/admin-image-field";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin-form-field";
import { AdminPageHeader } from "@/components/admin-page-header";
import { getFormErrorMessage } from "@/lib/admin-form-errors";
import { getAdminTeamBySlug } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { buildTitle } from "@/lib/seo";

type AdminEditTeamPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminEditTeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getAdminTeamBySlug(slug);

  return {
    title: buildTitle(team ? `Редагування: ${team.name}` : "Редагування команди"),
  };
}

export default async function AdminEditTeamPage({
  params,
  searchParams,
}: AdminEditTeamPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const { error } = await searchParams;
  const team = await getAdminTeamBySlug(slug);
  const errorMessage = getFormErrorMessage(error);

  if (!team) {
    notFound();
  }

  const matchesCount = team.homeMatches.length + team.awayMatches.length;

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <Link
        href="/admin/teams"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До списку команд
      </Link>

      <AdminPageHeader
        eyebrow="Команди"
        title="Редагування команди"
        description={`Оновіть дані команди. Пов'язані гравці: ${team.players.length}, матчі: ${matchesCount}.`}
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <AdminFormError message={errorMessage} />

        <form action={updateTeam.bind(null, team.slug)} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Назва команди">
            <input
              type="text"
              name="name"
              defaultValue={team.name}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Коротка назва" hint="2–4 символи для списків і скорочень.">
            <input
              type="text"
              name="short"
              defaultValue={team.short}
              required
              className={`${adminInputClass} uppercase`}
            />
          </AdminFormField>
          <AdminFormField label="Країна">
            <input
              type="text"
              name="country"
              defaultValue={team.country}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Рівень">
            <input
              type="text"
              name="level"
              defaultValue={team.level}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Домашня арена" className="md:col-span-2">
            <input
              type="text"
              name="stadium"
              defaultValue={team.stadium}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminImageField
            folder="teams"
            imageValue={team.image}
            imagePlaceholder="/team-image.svg"
          />
          <AdminFormField label="Опис команди" className="md:col-span-2">
            <textarea
              name="description"
              rows={6}
              defaultValue={team.description}
              required
              className={adminTextareaClass}
            />
          </AdminFormField>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              className={adminPrimaryButtonClass}
            >
              Зберегти зміни
            </button>
            <button
              formAction={deleteTeam.bind(null, team.slug)}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
            >
              Видалити команду
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
