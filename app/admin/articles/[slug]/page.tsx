import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle, updateArticle } from "@/app/admin/articles/actions";
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
import { extractTags, getAdminArticleBySlug } from "@/lib/db";
import { requireEditorAccess } from "@/lib/admin";
import { buildTitle } from "@/lib/seo";

type AdminEditArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminEditArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getAdminArticleBySlug(slug);

  return {
    title: buildTitle(article ? `Редагування: ${article.title}` : "Редагування статті"),
  };
}

export default async function AdminEditArticlePage({
  params,
  searchParams,
}: AdminEditArticlePageProps) {
  await requireEditorAccess("/admin/articles");
  const { slug } = await params;
  const { error } = await searchParams;
  const article = await getAdminArticleBySlug(slug);
  const errorMessage = getFormErrorMessage(error);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <Link
        href="/admin/articles"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До списку статей
      </Link>

      <AdminPageHeader
        eyebrow="Статті"
        title="Редагування статті"
        description="Оновіть поля матеріалу, збережіть зміни та за потреби залиште статтю в чернетках."
      />

      <section
        className={`rounded-[1.5rem] border p-5 ${
          article.published
            ? "border-emerald-200 bg-emerald-50/70"
            : "border-amber-200 bg-amber-50/70"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              article.published
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {article.published ? "Published" : "Draft"}
          </span>
          <p className="text-sm font-medium text-slate-900">
            {article.published
              ? "Матеріал зараз видимий на сайті."
              : "Матеріал зараз лишається лише в адмінці."}
          </p>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          {article.published
            ? "Якщо хочете спокійно допрацювати текст без показу читачам, зніміть прапорець публікації перед збереженням."
            : "Коли текст буде готовий, позначте його як опублікований і збережіть зміни."}
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <AdminFormError message={errorMessage} />

        <form action={updateArticle.bind(null, article.slug)} className="grid gap-4">
          <AdminFormField label="Заголовок" hint="Назва матеріалу для сайту і редакційного списку.">
            <input
              type="text"
              name="title"
              defaultValue={article.title}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminImageField
            folder="articles"
            imageValue={article.image}
            imagePlaceholder="/news-image.svg"
          />
          <AdminFormField label="Короткий опис" hint="Працює як короткий лід у картках новин, пошуку та SEO.">
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={article.excerpt}
              required
              className={adminTextareaClass}
            />
          </AdminFormField>
          <AdminFormField label="Дата публікації">
            <input
              type="date"
              name="date"
              defaultValue={article.date.toISOString().slice(0, 10)}
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Теги" hint="Через кому, щоб матеріал було простіше згрупувати за темою.">
            <input
              type="text"
              name="tags"
              defaultValue={extractTags(article.tags).join(", ")}
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Текст статті" hint="Редактор навмисно простий: основний текст без складного форматування.">
            <textarea
              name="content"
              rows={8}
              defaultValue={article.content}
              required
              className={adminTextareaClass}
            />
          </AdminFormField>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="published"
                defaultChecked={article.published}
                className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              Опубліковано
            </label>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Якщо прапорець знято, матеріал збережеться як чернетка і не
              показуватиметься у публічному розділі новин.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className={adminPrimaryButtonClass}
            >
              Зберегти зміни
            </button>
            <button
              formAction={deleteArticle.bind(null, article.slug)}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
            >
              Видалити статтю
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
