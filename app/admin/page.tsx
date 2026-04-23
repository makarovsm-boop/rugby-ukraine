import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { FallbackState } from "@/components/fallback-state";
import { requireAdmin } from "@/lib/admin";
import { formatDate, formatDateTime, getAdminDashboardData } from "@/lib/db";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Адмінка"),
  description: "Огляд основних показників і швидка навігація по адмінці Rugby Ukraine.",
  robots: {
    index: false,
    follow: false,
  },
};

const quickLinks = [
  { href: "/admin/articles", label: "Статті", description: "Створення, редагування і публікація матеріалів." },
  { href: "/admin/teams", label: "Команди", description: "Склади, опис і базові дані команд." },
  { href: "/admin/players", label: "Гравці", description: "Профілі гравців та прив'язка до команд." },
  { href: "/admin/championships", label: "Чемпіонати", description: "Турніри, описи та пов'язані матчі." },
  { href: "/admin/matches", label: "Матчі", description: "Календар, результати і статуси матчів." },
  { href: "/admin/comments", label: "Коментарі", description: "Модерація обговорень під статтями." },
];

export default async function AdminDashboardPage() {
  await requireAdmin();
  const { stats, recentArticles, recentComments } = await getAdminDashboardData();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Огляд"
        title="Загальний стан адмінки"
        description="Швидкий зріз по контенту, матчах, командах і коментарях, щоб бачити основну активність без зайвих переходів."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Статей</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.articles}</p>
        </article>
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Команд</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.teams}</p>
        </article>
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Гравців</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.players}</p>
        </article>
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Чемпіонатів</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.championships}</p>
        </article>
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Матчів</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.matches}</p>
        </article>
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
          <p className="text-sm text-slate-500">Коментарів</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{stats.comments}</p>
        </article>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Швидкі дії
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Куди перейти найчастіше
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)] transition-colors hover:border-[var(--accent)]/35"
            >
              <h3 className="text-lg font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Останні статті
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Свіжі оновлення редакції
              </h2>
            </div>
            <Link href="/admin/articles" className="text-sm font-semibold text-[var(--accent)]">
              Усі статті
            </Link>
          </div>

          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{formatDate(article.date)}</span>
                    <span
                      className={`rounded-full px-3 py-1 font-medium ${
                        article.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {article.published ? "Опубліковано" : "Чернетка"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">
                    {article.title}
                  </h3>
                  <Link
                    href={`/admin/articles/${article.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Відкрити редагування
                  </Link>
                </article>
              ))
            ) : (
              <FallbackState
                title="Статей поки немає"
                description="Коли в адмінці з’являться матеріали, тут буде видно останні оновлення редакції."
              />
            )}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Останні коментарі
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Свіжа активність читачів
              </h2>
            </div>
            <Link href="/admin/comments" className="text-sm font-semibold text-[var(--accent)]">
              Усі коментарі
            </Link>
          </div>

          <div className="space-y-4">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <span>{comment.user.name}</span>
                    <span>{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-950">
                    {comment.article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {comment.content}
                  </p>
                  <Link
                    href={`/news/${comment.article.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Перейти до статті
                  </Link>
                </article>
              ))
            ) : (
              <FallbackState
                title="Коментарів поки немає"
                description="Коли читачі почнуть обговорювати матеріали, тут буде видно останню активність."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
