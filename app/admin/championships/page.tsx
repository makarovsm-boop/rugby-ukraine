import type { Metadata } from "next";
import Link from "next/link";
import {
  createChampionship,
  deleteChampionship,
} from "@/app/admin/championships/actions";
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
import { getChampionshipPreviewSlug } from "@/lib/championship-data";
import { getAdminChampionships } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка чемпіонатів | Rugby Ukraine",
  description: "Проста адмінка для створення та редагування чемпіонатів Rugby Ukraine.",
};

type AdminChampionshipsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminChampionshipsPage({
  searchParams,
}: AdminChampionshipsPageProps) {
  await requireAdmin();
  const { error, success } = await searchParams;
  const championships = await getAdminChampionships();
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Чемпіонати"
        title="Керування чемпіонатами"
        description="Редагуйте турніри, сезонні дані та короткий контекст для публічних сторінок чемпіонатів."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Новий чемпіонат
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Додайте турнір із базовим описом, сезоном і регіоном, щоб він одразу
            коректно виглядав на публічних сторінках.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createChampionship} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Назва чемпіонату">
            <input type="text" name="title" placeholder="Наприклад: Чемпіонат Європи" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Сезон" hint="Наприклад: 2025/26 або 2026.">
            <input type="text" name="season" placeholder="2025/26" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Регіон">
            <input type="text" name="region" placeholder="Європа" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Формат">
            <input type="text" name="format" placeholder="Збірні або Клуби" required className={adminInputClass} />
          </AdminFormField>
          <AdminImageField
            folder="championships"
            imagePlaceholder="/championship-image.svg"
          />
          <AdminFormField label="Опис турніру" hint="Коротко поясніть, чим турнір важливий для читача." className="md:col-span-2">
            <textarea name="description" rows={5} placeholder="Опис турніру" required className={adminTextareaClass} />
          </AdminFormField>
          <button
            type="submit"
            className={`${adminPrimaryButtonClass} md:col-span-2`}
          >
            Створити чемпіонат
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Усі чемпіонати</h2>

        {championships.map((championship) => (
          (() => {
            const previewSlug = getChampionshipPreviewSlug({
              slug: championship.slug,
              title: championship.title,
            });

            return (
          <article
            key={championship.id}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    {championship.season}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{championship.region}</span>
                  <span className="text-slate-300">•</span>
                  <span>{championship.format}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {championship.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {championship.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Матчів: {championship.matches.length}</span>
                  <span>Зображення: {championship.image}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/championships/${previewSlug}`}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                >
                  Перегляд
                </Link>
                <Link
                  href={`/admin/championships/${championship.slug}`}
                  className="dark-pill-button inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
                >
                  Редагувати
                </Link>
                <form action={deleteChampionship.bind(null, championship.slug)}>
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
          })()
        ))}
      </section>
    </div>
  );
}

