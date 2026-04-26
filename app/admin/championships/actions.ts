"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { resolveImageUpload, UploadStorageError } from "@/lib/uploads";
import {
  createChampionshipId,
  createSlug,
  requireAdmin,
} from "@/lib/admin";
import {
  findChampionshipOverrideBySlug,
  getChampionshipCanonicalSlug,
} from "@/lib/championship-data";

export async function createChampionship(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const season = String(formData.get("season") ?? "").trim();
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "championships",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError("/admin/championships", error.message);
    }

    throw error;
  }

  if (!title || !region || !format || !description || !season) {
    redirectWithFormError(
      "/admin/championships",
      "Заповніть назву, регіон, формат, опис і сезон чемпіонату.",
    );
  }

  const slugBase = createSlug(title);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.championship.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  await prisma.championship.create({
    data: {
      id: createChampionshipId(),
      slug,
      title,
      region,
      format,
      description,
      season,
      image,
    },
  });

  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/championships");
  redirectWithFormSuccess("/admin/championships", "Чемпіонат успішно створено.");
}

export async function updateChampionship(slug: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const season = String(formData.get("season") ?? "").trim();
  const currentChampionship = await prisma.championship.findUnique({
    where: { slug },
    select: { image: true },
  });
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "championships",
      fallbackImage: currentChampionship?.image ?? "",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError(`/admin/championships/${slug}`, error.message);
    }

    throw error;
  }

  if (!title || !region || !format || !description || !season) {
    redirectWithFormError(
      `/admin/championships/${slug}`,
      "Заповніть назву, регіон, формат, опис і сезон чемпіонату.",
    );
  }

  const slugBase = createSlug(title);
  let nextSlug = slugBase;
  let counter = 1;

  while (true) {
    const existingChampionship = await prisma.championship.findUnique({
      where: { slug: nextSlug },
      select: { slug: true },
    });

    if (!existingChampionship || existingChampionship.slug === slug) {
      break;
    }

    counter += 1;
    nextSlug = `${slugBase}-${counter}`;
  }

  await prisma.championship.update({
    where: { slug },
    data: {
      slug: nextSlug,
      title,
      region,
      format,
      description,
      season,
      image,
    },
  });

  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/championships/${slug}`);
  revalidatePath(`/championships/${nextSlug}`);
  revalidatePath("/admin/championships");
  revalidatePath(`/admin/championships/${slug}`);
  redirectWithFormSuccess("/admin/championships", "Зміни до чемпіонату збережено.");
}

export async function createChampionshipFromOverride(slug: string) {
  await requireAdmin();

  const override = findChampionshipOverrideBySlug(slug);

  if (!override) {
    redirectWithFormError(
      "/admin/championships",
      "Не вдалося знайти шаблон чемпіонату для додавання.",
    );
  }

  const existingByTitle = await prisma.championship.findFirst({
    where: { title: override.title },
    select: { id: true },
  });

  if (existingByTitle) {
    redirectWithFormSuccess(
      "/admin/championships",
      "Такий чемпіонат уже є в адмінці.",
    );
  }

  const existingBySlug = await prisma.championship.findUnique({
    where: { slug: override.slug },
    select: { slug: true, title: true },
  });

  if (existingBySlug) {
    const normalizedSlug = getChampionshipCanonicalSlug({
      slug: existingBySlug.slug,
      title: existingBySlug.title,
    });

    if (normalizedSlug !== override.slug) {
      const conflictingSlug = await prisma.championship.findUnique({
        where: { slug: normalizedSlug },
        select: { slug: true },
      });

      if (!conflictingSlug) {
        await prisma.championship.update({
          where: { slug: existingBySlug.slug },
          data: { slug: normalizedSlug },
        });
      }
    }
  }

  let nextSlug = override.slug;
  let counter = 1;

  while (await prisma.championship.findUnique({ where: { slug: nextSlug } })) {
    counter += 1;
    nextSlug = `${override.slug}-${counter}`;
  }

  await prisma.championship.create({
    data: {
      id: createChampionshipId(),
      slug: nextSlug,
      title: override.title,
      region: override.region,
      format: override.format,
      description: override.description,
      season: override.season,
      image: override.image,
    },
  });

  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/championships");
  redirectWithFormSuccess(
    "/admin/championships",
    "Шаблон чемпіонату додано в адмінку.",
  );
}

export async function deleteChampionship(slug: string) {
  await requireAdmin();

  await prisma.championship.delete({
    where: { slug },
  });

  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/championships/${slug}`);
  revalidatePath("/admin/championships");
  revalidatePath(`/admin/championships/${slug}`);
  redirect("/admin/championships");
}
