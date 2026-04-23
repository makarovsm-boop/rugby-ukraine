import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteChampionship,
  updateChampionship,
} from "@/app/admin/championships/actions";
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
import { getAdminChampionshipBySlug } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { buildTitle } from "@/lib/seo";

type AdminEditChampionshipPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminEditChampionshipPageProps): Promise<Metadata> {
  const { slug } = await params;
  const championship = await getAdminChampionshipBySlug(slug);

  return {
    title: buildTitle(
      championship ? `Редагування: ${championship.title}` : "Редагування чемпіонату",
    ),
  };
}

export default async function AdminEditChampionshipPage({
  params,
  searchParams,
}: AdminEditChampionshipPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const { error } = await searchParams;
  const championship = await getAdminChampionshipBySlug(slug);
  const errorMessage = getFormErrorMessage(error);

  if (!championship) {
    notFound();
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <Link
        href="/admin/championships"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До списку чемпіонатів
      </Link>

      <AdminPageHeader
        eyebrow="Чемпіонати"
        title="Редагування чемпіонату"
        description={`Оновіть дані турніру. Пов'язаних матчів: ${championship.matches.length}.`}
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <AdminFormError message={errorMessage} />

        <form
          action={updateChampionship.bind(null, championship.slug)}
          className="grid gap-4 md:grid-cols-2"
        >
          <AdminFormField label="Назва чемпіонату">
            <input
              type="text"
              name="title"
              defaultValue={championship.title}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Сезон">
            <input
              type="text"
              name="season"
              defaultValue={championship.season}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Регіон">
            <input
              type="text"
              name="region"
              defaultValue={championship.region}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Формат">
            <input
              type="text"
              name="format"
              defaultValue={championship.format}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminImageField
            folder="championships"
            imageValue={championship.image}
            imagePlaceholder="/championship-image.svg"
          />
          <AdminFormField label="Опис турніру" className="md:col-span-2">
            <textarea
              name="description"
              rows={6}
              defaultValue={championship.description}
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
              formAction={deleteChampionship.bind(null, championship.slug)}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
            >
              Видалити чемпіонат
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
