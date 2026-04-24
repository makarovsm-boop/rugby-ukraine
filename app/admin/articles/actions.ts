"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { resolveImageUpload, UploadStorageError } from "@/lib/uploads";
import {
  createArticleId,
  createSlug,
  parseTags,
  requireEditorAccess,
} from "@/lib/admin";

function revalidateArticlePaths(slug: string) {
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${slug}`);
}

export async function createArticle(formData: FormData) {
  const admin = await requireEditorAccess("/admin/articles");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const published = formData.get("published") === "on";
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "articles",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError("/admin/articles", error.message);
    }

    throw error;
  }

  if (!title || !excerpt || !content || !date) {
    redirectWithFormError(
      "/admin/articles",
      "Заповніть заголовок, короткий опис, текст і дату статті.",
    );
  }

  if (Number.isNaN(new Date(date).getTime())) {
    redirectWithFormError("/admin/articles", "Вкажіть коректну дату статті.");
  }

  const slugBase = createSlug(title);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  await prisma.article.create({
    data: {
      id: createArticleId(),
      slug,
      title,
      excerpt,
      content,
      image,
      date: new Date(date),
      tags: parseTags(tags),
      published,
      authorId: admin.id,
    },
  });

  revalidateArticlePaths(slug);
  revalidatePath("/admin/articles");
  redirectWithFormSuccess(
    "/admin/articles",
    published
      ? "Статтю створено і одразу опубліковано."
      : "Чернетку створено. Вона поки не видима на сайті.",
  );
}

export async function updateArticle(slug: string, formData: FormData) {
  await requireEditorAccess("/admin/articles");

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const published = formData.get("published") === "on";
  const currentArticle = await prisma.article.findUnique({
    where: { slug },
    select: { image: true },
  });
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "articles",
      fallbackImage: currentArticle?.image ?? "",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError(`/admin/articles/${slug}`, error.message);
    }

    throw error;
  }

  if (!title || !excerpt || !content || !date) {
    redirectWithFormError(
      `/admin/articles/${slug}`,
      "Заповніть заголовок, короткий опис, текст і дату статті.",
    );
  }

  if (Number.isNaN(new Date(date).getTime())) {
    redirectWithFormError(
      `/admin/articles/${slug}`,
      "Вкажіть коректну дату статті.",
    );
  }

  await prisma.article.update({
    where: { slug },
    data: {
      title,
      excerpt,
      content,
      image,
      date: new Date(date),
      tags: parseTags(tags),
      published,
    },
  });

  revalidateArticlePaths(slug);
  redirectWithFormSuccess(
    "/admin/articles",
    published
      ? "Зміни збережено. Стаття лишається опублікованою."
      : "Зміни збережено. Стаття лишається у чернетках.",
  );
}

export async function deleteArticle(slug: string) {
  await requireEditorAccess("/admin/articles");

  await prisma.article.delete({
    where: { slug },
  });

  revalidateArticlePaths(slug);
  redirectWithFormSuccess("/admin/articles", "Статтю видалено.");
}

export async function toggleArticlePublished(
  slug: string,
  nextPublished: boolean,
  statusFilter: string,
) {
  await requireEditorAccess("/admin/articles");

  await prisma.article.update({
    where: { slug },
    data: {
      published: nextPublished,
    },
  });

  revalidateArticlePaths(slug);
  revalidatePath("/admin/articles");
  redirectWithFormSuccess(
    `/admin/articles?status=${statusFilter}`,
    nextPublished
      ? "Статтю опубліковано. Вона вже доступна на сайті."
      : "Статтю повернуто в чернетки. Вона більше не показується публічно.",
  );
}
