import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePlayer, updatePlayer } from "@/app/admin/players/actions";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminImageField } from "@/components/admin-image-field";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin-form-field";
import { AdminPageHeader } from "@/components/admin-page-header";
import { getFormErrorMessage } from "@/lib/admin-form-errors";
import { getAdminPlayerBySlug, getTeamsForAdminSelect } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { buildTitle } from "@/lib/seo";

type AdminEditPlayerPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminEditPlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getAdminPlayerBySlug(slug);

  return {
    title: buildTitle(player ? `Редагування: ${player.name}` : "Редагування гравця"),
  };
}

export default async function AdminEditPlayerPage({
  params,
  searchParams,
}: AdminEditPlayerPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const { error } = await searchParams;
  const [player, teams] = await Promise.all([
    getAdminPlayerBySlug(slug),
    getTeamsForAdminSelect(),
  ]);
  const errorMessage = getFormErrorMessage(error);

  if (!player) {
    notFound();
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <Link
        href="/admin/players"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До списку гравців
      </Link>

      <AdminPageHeader
        eyebrow="Гравці"
        title="Редагування гравця"
        description="Оновіть профіль гравця, його прив’язку до команди та ключові публічні характеристики."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <AdminFormError message={errorMessage} />

        <form action={updatePlayer.bind(null, player.slug)} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Ім'я та прізвище">
            <input
              type="text"
              name="name"
              defaultValue={player.name}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Команда">
            <select
              name="teamId"
              defaultValue={player.teamId}
              required
              className={adminSelectClass}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Позиція">
            <input
              type="text"
              name="position"
              defaultValue={player.position}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Номер">
            <input
              type="number"
              name="number"
              min={1}
              defaultValue={player.number}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Вік">
            <input
              type="number"
              name="age"
              min={1}
              defaultValue={player.age}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Зріст">
            <input
              type="text"
              name="height"
              defaultValue={player.height}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Вага">
            <input
              type="text"
              name="weight"
              defaultValue={player.weight}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminImageField
            folder="players"
            imageValue={player.image}
            imagePlaceholder="/player-image.svg"
          />
          <AdminFormField label="Короткий опис" className="md:col-span-2">
            <textarea
              name="summary"
              rows={3}
              defaultValue={player.summary}
              required
              className={adminTextareaClass}
            />
          </AdminFormField>
          <AdminFormField label="Розширений профіль" className="md:col-span-2">
            <textarea
              name="bio"
              rows={6}
              defaultValue={player.bio}
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
              formAction={deletePlayer.bind(null, player.slug)}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
            >
              Видалити гравця
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
