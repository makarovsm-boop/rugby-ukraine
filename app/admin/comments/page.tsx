import type { Metadata } from "next";
import Link from "next/link";
import { deleteComment } from "@/app/admin/comments/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  formatDateTime,
  getAdminCommentsFilters,
  getFilteredAdminComments,
} from "@/lib/db";
import { requireEditorAccess } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Адмінка коментарів | Rugby Ukraine",
  description: "Проста адмінка для модерації коментарів Rugby Ukraine.",
};

type AdminCommentsPageProps = {
  searchParams: Promise<{
    article?: string;
    freshness?: string;
  }>;
};

const freshnessOptions = [
  { value: "all", label: "Усі" },
  { value: "today", label: "За сьогодні" },
  { value: "7days", label: "За 7 днів" },
  { value: "30days", label: "За 30 днів" },
];

function buildCommentsHref(filters?: { article?: string; freshness?: string }) {
  const params = new URLSearchParams();

  if (filters?.article) {
    params.set("article", filters.article);
  }

  if (filters?.freshness && filters.freshness !== "all") {
    params.set("freshness", filters.freshness);
  }

  const query = params.toString();

  return query ? `/admin/comments?${query}` : "/admin/comments";
}

export default async function AdminCommentsPage({
  searchParams,
}: AdminCommentsPageProps) {
  await requireEditorAccess("/admin/comments");
  const { article, freshness = "all" } = await searchParams;
  const [comments, articles] = await Promise.all([
    getFilteredAdminComments({ articleSlug: article, freshness }),
    getAdminCommentsFilters(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Коментарі"
        title="Модерація коментарів"
        description="Переглядайте обговорення, фільтруйте коментарі за статтями та швидко прибирайте зайве."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Стаття:</span>
            <Link
              href={buildCommentsHref({ freshness })}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !article
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              }`}
            >
              Усі
            </Link>
            {articles.map((item) => (
              <Link
                key={item.slug}
                href={buildCommentsHref({ article: item.slug, freshness })}
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  article === item.slug
                    ? "bg-[var(--accent)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-900">Свіжість:</span>
            {freshnessOptions.map((option) => (
              <Link
                key={option.value}
                href={buildCommentsHref({
                  article,
                  freshness: option.value,
                })}
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  freshness === option.value
                    ? "bg-[var(--accent)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-950">Коментарі</h2>
          <p className="text-sm text-slate-500">Знайдено: {comments.length}</p>
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{formatDateTime(comment.createdAt)}</span>
                    <span className="text-slate-300">•</span>
                    <span>{comment.user.name}</span>
                    <span className="text-slate-300">•</span>
                    <span>{comment.user.email}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-950">
                    {comment.article.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600">
                    {comment.content}
                  </p>

                  <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Стаття</p>
                    <p className="mt-2">{comment.article.title}</p>
                    <p className="mt-1 text-slate-500">{comment.article.excerpt}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/news/${comment.article.slug}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                  >
                    Відкрити статтю
                  </Link>
                  <Link
                    href={`/admin/articles/${comment.article.slug}`}
                    className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    До статті в адмінці
                  </Link>
                  <form action={deleteComment.bind(null, comment.id, comment.article.slug)}>
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
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-950">
              Коментарів поки немає
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Коли користувачі залишать відгуки під статтями, вони з&apos;являться тут.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

