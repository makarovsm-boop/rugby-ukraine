import type { Metadata } from "next";
import Link from "next/link";
import {
  createArticle,
  deleteArticle,
  importEditorialArticle,
  toggleArticlePublished,
} from "@/app/admin/articles/actions";
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
import { extractTags, formatDate, getAdminArticles } from "@/lib/db";
import { requireEditorAccess } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка статей | Rugby Ukraine",
  description: "Проста адмінка для створення та редагування статей Rugby Ukraine.",
};

type AdminArticlesPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
    success?: string;
  }>;
};

function renderArticleCard(
  article: Awaited<ReturnType<typeof getAdminArticles>>[number],
  statusFilter: string,
) {
  const tags = extractTags(article.tags);
  const isEditorialOnly = article.authorId === "editorial";

  return (
    <article
      key={article.id}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{formatDate(article.date)}</span>
            <span className="text-slate-300">•</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                article.published
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {article.published ? "Опубліковано" : "Чернетка"}
            </span>
            {isEditorialOnly ? (
              <>
                <span className="text-slate-300">•</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  Редакційний матеріал
                </span>
              </>
            ) : null}
            {tags.length > 0 ? <span className="text-slate-300">•</span> : null}
            {tags.length > 0 ? <span>{tags.join(", ")}</span> : null}
          </div>
          <h3 className="text-xl font-semibold text-slate-950">
            {article.title}
          </h3>
          <p className="text-sm leading-7 text-slate-600">{article.excerpt}</p>
          <p className="text-xs leading-6 text-slate-500">
            {isEditorialOnly
              ? "Матеріал зараз підтягується з редакційного override. Додайте його в адмінку, якщо хочете редагувати текст, фото чи статус публікації."
              : article.published
              ? "Матеріал зараз видимий читачам у розділі новин і в пошуку."
              : "Матеріал зараз лишається чернеткою і видимий лише в адмінці."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditorialOnly ? (
            <form
              action={toggleArticlePublished.bind(
                null,
                article.slug,
                !article.published,
                statusFilter,
              )}
            >
              <button
                type="submit"
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  article.published
                    ? "border border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                {article.published ? "У чернетку" : "Опублікувати"}
              </button>
            </form>
          ) : null}
          {article.published ? (
            <Link
              href={`/news/${encodeURIComponent(article.slug.trim())}`}
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
            >
              Перегляд
            </Link>
          ) : null}
          {isEditorialOnly ? (
            <form
              action={importEditorialArticle.bind(null, article.slug, statusFilter)}
            >
              <button
                type="submit"
                className="dark-pill-button inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
              >
                Додати в адмінку
              </button>
            </form>
          ) : (
            <>
              <Link
                href={`/admin/articles/${encodeURIComponent(article.slug.trim())}`}
                className="dark-pill-button inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-800"
              >
                Редагувати
              </Link>
              <form action={deleteArticle.bind(null, article.slug)}>
                <button
                  type="submit"
                  className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100"
                >
                  Видалити
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function AdminArticlesPage({
  searchParams,
}: AdminArticlesPageProps) {
  await requireEditorAccess("/admin/articles");
  const { status = "all", error, success } = await searchParams;
  const articles = await getAdminArticles();
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  const drafts = articles.filter((article) => !article.published);
  const publishedArticles = articles.filter((article) => article.published);
  const filteredArticles = articles.filter((article) => {
    if (status === "published") {
      return article.published;
    }

    if (status === "drafts") {
      return !article.published;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Статті"
        title="Керування статтями"
        description="Створюйте нові матеріали, працюйте з чернетками та швидко перемикайте статті між статусами."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
              Draft
            </span>
            <h2 className="text-lg font-semibold text-slate-950">Чернетка</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Чернетка лишається лише в адмінці. Її можна спокійно допрацьовувати,
            не показуючи читачам незавершений матеріал.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Published
            </span>
            <h2 className="text-lg font-semibold text-slate-950">Опубліковано</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Опублікована стаття одразу потрапляє в новини, у пошук і на публічні
            сторінки сайту. Якщо треба її приховати, поверніть матеріал у чернетки.
          </p>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Нова стаття
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Заповніть базові поля матеріалу. Короткий опис використовується в картках,
            пошуку та SEO.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createArticle} className="grid gap-4">
          <AdminFormField label="Заголовок" hint="Короткий і зрозумілий заголовок для читача.">
            <input type="text" name="title" placeholder="Наприклад: Збірна України оголосила склад" required className={adminInputClass} />
          </AdminFormField>
          <AdminImageField folder="articles" imagePlaceholder="/news-image.svg" />
          <AdminFormField label="Короткий опис" hint="Цей текст бачать у картках новин, у пошуку та в SEO-описі.">
            <textarea name="excerpt" rows={3} placeholder="Коротко поясніть суть матеріалу" required className={adminTextareaClass} />
          </AdminFormField>
          <AdminFormField label="Дата публікації">
            <input type="date" name="date" required className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Теги" hint="Вкажіть через кому, наприклад: Збірна України, Підготовка, Склад.">
            <input type="text" name="tags" placeholder="Теги через кому" className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Текст статті" hint="Поки без складного редактора: просто основний текст матеріалу.">
            <textarea name="content" rows={6} placeholder="Текст статті" required className={adminTextareaClass} />
          </AdminFormField>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="published"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              Опублікувати одразу
            </label>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Якщо зняти прапорець, матеріал створиться як чернетка і не буде
              доступний на публічному сайті.
            </p>
          </div>
          <button
            type="submit"
            className={adminPrimaryButtonClass}
          >
            Створити статтю
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Редакційний список
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Фільтр допомагає швидко перейти до опублікованих матеріалів або чернеток.
              На публічному сайті показуються лише статті зі статусом
              <span className="font-semibold text-slate-900"> Опубліковано</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/articles?status=all"
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                status === "all"
                  ? "dark-pill-button"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Усі ({articles.length})
            </Link>
            <Link
              href="/admin/articles?status=published"
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                status === "published"
                  ? "dark-pill-button"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Опубліковані ({publishedArticles.length})
            </Link>
            <Link
              href="/admin/articles?status=drafts"
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                status === "drafts"
                  ? "dark-pill-button"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Чернетки ({drafts.length})
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
            <p className="text-sm text-slate-500">Усього матеріалів</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {articles.length}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
            <p className="text-sm text-slate-500">Опубліковані</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {articles.filter((article) => article.published).length}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
            <p className="text-sm text-slate-500">Чернетки</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {drafts.length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => renderArticleCard(article, status))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">
                За цим фільтром статей немає
              </p>
            </div>
          )}
        </div>
      </section>

      {status !== "drafts" ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Окремий список чернеток
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Тут зібрані всі непубліковані матеріали для швидкого повернення в роботу.
            </p>
          </div>

          {drafts.length > 0 ? (
            drafts.map((article) => renderArticleCard(article, status))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">
                Чернеток зараз немає
              </p>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

