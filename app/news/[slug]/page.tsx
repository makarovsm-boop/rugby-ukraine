import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createComment } from "@/app/news/[slug]/actions";
import { CommentForm } from "@/app/news/[slug]/comment-form";
import {
  extractTags,
  formatDate,
  formatDateTime,
  getNewsArticle,
  getNewsList,
  getRelatedNews,
} from "@/lib/db";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle, siteConfig } from "@/lib/seo";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const articles = await getNewsList();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    return {
      title: buildTitle("Новини"),
    };
  }

  const safeImage = await getSafeImagePath(article.image, "articles");

  return {
    title: buildTitle(article.title),
    description: article.excerpt,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      title: buildTitle(article.title),
      description: article.excerpt,
      url: `${siteConfig.url}/news/${article.slug}`,
      type: "article",
      images: [
        {
          url: safeImage,
        },
      ],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const article = await getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedNews(slug);
  const tags = extractTags(article.tags);
  const safeImage = await getSafeImagePath(article.image, "articles");
  const sortedComments = [...article.comments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const contentParagraphs = article.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const readableParagraphs =
    contentParagraphs.length > 0 ? contentParagraphs : [article.content];
  const sourceName =
    "sourceName" in article && typeof article.sourceName === "string"
      ? article.sourceName
      : "";
  const sourceUrl =
    "sourceUrl" in article && typeof article.sourceUrl === "string"
      ? article.sourceUrl
      : "";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: `${siteConfig.url}/news/${article.slug}`,
    url: `${siteConfig.url}/news/${article.slug}`,
    image: [safeImage],
    articleSection: "Новини",
    keywords: tags,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/favicon.ico`,
      },
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link
        href="/news"
        className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      >
        До всіх новин
      </Link>

      <article className="content-card-strong overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/8]">
          <Image
            src={safeImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 960px"
          />
        </div>

        <div className="space-y-6 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{formatDate(article.date)}</span>
            <span className="text-slate-300">•</span>
            <span>Редакція Rugby Ukraine</span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            {article.excerpt}
          </p>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
            <p className="font-semibold text-slate-900">Редакційний контекст</p>
            <p className="mt-2">
              Це редакційний матеріал Rugby Ukraine. Ми намагаємося стисло
              відділяти сам факт події від пояснення, чому вона важлива для
              українського читача. Якщо тема ще розвивається, текст може
              оновлюватися після публікації.
            </p>
            {sourceName && sourceUrl ? (
              <p className="mt-2">
                Джерело:{" "}
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                >
                  {sourceName}
                </a>
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.5rem] bg-slate-50/80 p-5 sm:p-6">
            <div className="prose prose-slate max-w-none text-slate-700 prose-p:my-0 prose-p:leading-8 prose-headings:text-slate-950">
              <div className="space-y-5 text-[15px] leading-8 sm:text-base">
                {readableParagraphs.map((paragraph, index) => (
                  <p
                    key={`${article.id}-paragraph-${index + 1}`}
                    className={
                      index === 0
                        ? "text-base font-medium text-slate-800 sm:text-lg"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Коментарі
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Обговорення статті
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Думки читачів показані від найновіших до старіших, щоб свіжі
              відповіді було легше побачити одразу.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Усього: {sortedComments.length}
          </p>
        </div>

        {session?.user ? (
          <section className="content-card rounded-[1.5rem] p-6">
            <CommentForm
              action={createComment.bind(null, article.id, article.slug)}
              userName={session.user.name ?? "Користувач"}
              userEmail={session.user.email ?? ""}
            />
          </section>
        ) : (
          <section className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="text-lg font-semibold text-slate-950">
              Увійдіть, щоб долучитися до обговорення
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Коментарі доступні лише для авторизованих користувачів. Після входу
              ви зможете одразу залишити свою думку під матеріалом.
            </p>
            <Link
              href={`/login?callbackUrl=/news/${article.slug}`}
              className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
            >
              Увійти для коментування
            </Link>
          </section>
        )}

        <div className="space-y-4">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <article
                key={comment.id}
                className="content-card rounded-[1.5rem] p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-950">
                      {comment.user.name}
                    </p>
                    <p className="text-sm text-slate-500">{comment.user.email}</p>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-700">
                  {comment.content}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">
                Поки що ніхто не почав обговорення
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Якщо у вас є думка про цей матеріал, можна стати першим, хто
                залишить коментар і задасть тон дискусії.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Ще новини
          </p>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Схожі матеріали
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Це не автоматичні рекомендації з усього інтернету, а найближчі за
              темою редакційні матеріали всередині Rugby Ukraine.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {relatedArticles.map((relatedArticle) => (
            <article
              key={relatedArticle.slug}
              className="content-card rounded-[1.5rem] p-5 transition-colors hover:border-[var(--accent)]/25 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{formatDate(relatedArticle.date)}</span>
                <span className="text-slate-300">•</span>
                <span>{extractTags(relatedArticle.tags)[0] ?? "Новина"}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {extractTags(relatedArticle.tags).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-950">
                {relatedArticle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {relatedArticle.excerpt}
              </p>
              <Link
                href={`/news/${relatedArticle.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]"
              >
                Відкрити матеріал
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
