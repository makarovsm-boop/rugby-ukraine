import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import {
  extractTags,
  formatDate,
  getPaginatedNewsList,
  NEWS_PAGE_SIZE,
} from "@/lib/db";
import { getSafeImagePath } from "@/lib/media";
import { buildTitle, siteConfig } from "@/lib/seo";

type NewsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function parsePage(value?: string) {
  const page = Number(value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

function buildNewsPageHref(page: number) {
  return page <= 1 ? "/news" : `/news?page=${page}`;
}

export async function generateMetadata({
  searchParams,
}: NewsPageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = parsePage(page);
  const pageTitle =
    currentPage > 1 ? `Новини - сторінка ${currentPage}` : "Новини";
  const description =
    "Новини українського та світового регбі на Rugby Ukraine.";

  return {
    title: buildTitle(pageTitle),
    description,
    alternates: {
      canonical: buildNewsPageHref(currentPage),
    },
    openGraph: {
      title: buildTitle(pageTitle),
      description,
      url: `${siteConfig.url}${buildNewsPageHref(currentPage)}`,
      type: "website",
    },
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams;
  const requestedPage = parsePage(page);
  const {
    items: newsArticles,
    total,
    page: currentPage,
    totalPages,
    hasPrevPage,
    hasNextPage,
  } = await getPaginatedNewsList(requestedPage, NEWS_PAGE_SIZE);

  const from = newsArticles.length > 0 ? (currentPage - 1) * NEWS_PAGE_SIZE + 1 : 0;
  const to = newsArticles.length > 0 ? from + newsArticles.length - 1 : 0;
  const [featuredArticle, ...otherArticles] = newsArticles;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: currentPage > 1 ? `Новини Rugby Ukraine - сторінка ${currentPage}` : "Новини Rugby Ukraine",
    url: `${siteConfig.url}${buildNewsPageHref(currentPage)}`,
    description:
      "Новини українського та світового регбі на Rugby Ukraine.",
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: newsArticles.length,
      itemListElement: newsArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/news/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageIntro
        title="Новини"
        description="Головні події українського та світового регбі: збірні, клубний сезон, розвиток гри в Україні та редакційний контекст, який допомагає швидко зрозуміти значення новини."
      />

      <div className="content-card flex flex-col gap-3 rounded-[1.5rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Матеріалів у розділі: <span className="font-semibold text-slate-950">{total}</span>
        </p>
        <p className="text-sm text-slate-600">
          Сторінка{" "}
          <span className="font-semibold text-slate-950">
            {currentPage} / {totalPages}
          </span>
        </p>
      </div>

      <section className="content-card rounded-[1.5rem] p-5 text-sm leading-7 text-slate-600">
        <p>
          У цьому розділі ми відокремлюємо факти від контексту: заголовок і дата
          показують саму подію, а короткий опис допомагає зрозуміти, чому вона
          важлива для українського читача. Матеріали готує редакція Rugby Ukraine.
        </p>
        <p className="mt-3">
          Якщо новина ще розвивається, текст може оновлюватися після першої
          публікації. Для офіційних підтверджень складів, дат і регламентів
          варто також перевіряти першоджерела турніру або команди.
        </p>
      </section>

      {featuredArticle ? (
        <section className="content-card-strong overflow-hidden rounded-[2rem]">
          {await (async () => {
            const safeImage = await getSafeImagePath(featuredArticle.image, "articles");
            const tags = extractTags(featuredArticle.tags);

            return (
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative aspect-[16/11] min-h-[18rem] lg:aspect-auto">
                  <Image
                    src={safeImage}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                    priority={currentPage === 1}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                      Головний матеріал
                    </span>
                    <span>{formatDate(featuredArticle.date)}</span>
                    {tags[0] ? <span className="text-slate-300">•</span> : null}
                    {tags[0] ? <span>{tags[0]}</span> : null}
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                    {featuredArticle.title}
                  </h2>

                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {featuredArticle.excerpt}
                  </p>

                  <p className="mt-4 text-xs leading-6 text-slate-500">
                    Редакційний матеріал Rugby Ukraine. Дата в картці показує день
                    публікації або останнього змістовного оновлення.
                  </p>

                  <Link
                    href={`/news/${featuredArticle.slug}`}
                    className="mt-6 inline-flex w-fit rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                  >
                    Читати матеріал
                  </Link>
                </div>
              </div>
            );
          })()}
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {await Promise.all(
          otherArticles.map(async (article) => {
            const safeImage = await getSafeImagePath(article.image, "articles");
            const tags = extractTags(article.tags);

            return (
              <article
                key={article.slug}
                className="content-card overflow-hidden rounded-[1.5rem]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={safeImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{formatDate(article.date)}</span>
                    {tags[0] ? <span className="text-slate-300">•</span> : null}
                    {tags[0] ? <span>{tags[0]}</span> : null}
                  </div>

                  <h2 className="text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                    {article.title}
                  </h2>

                  <p className="text-sm leading-7 text-slate-600">
                    {article.excerpt}
                  </p>

                  <p className="text-xs leading-6 text-slate-500">
                    Коротке редакційне пояснення, чому ця тема важлива саме зараз.
                  </p>

                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                  >
                    Читати далі
                  </Link>
                </div>
              </article>
            );
          }),
        )}
      </section>

      <nav className="content-card flex items-center justify-between gap-4 rounded-[1.5rem] px-5 py-4">
        {hasPrevPage ? (
          <Link
            href={buildNewsPageHref(currentPage - 1)}
            className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            Попередня
          </Link>
        ) : (
          <span className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-300">
            Попередня
          </span>
        )}

        <span className="text-sm text-slate-500">
          {from}-{to} з {total}
        </span>

        {hasNextPage ? (
          <Link
            href={buildNewsPageHref(currentPage + 1)}
            className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            Наступна
          </Link>
        ) : (
          <span className="inline-flex rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400">
            Наступна
          </span>
        )}
      </nav>
    </div>
  );
}
