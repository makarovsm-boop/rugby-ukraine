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

  await prisma.championship.update({
    where: { slug },
    data: {
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
  revalidatePath("/admin/championships");
  revalidatePath(`/admin/championships/${slug}`);
  redirectWithFormSuccess("/admin/championships", "Зміни до чемпіонату збережено.");
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
