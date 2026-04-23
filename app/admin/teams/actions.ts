"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { resolveImageUpload } from "@/lib/uploads";
import { createSlug, createTeamId, requireAdmin } from "@/lib/admin";

export async function createTeam(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const short = String(formData.get("short") ?? "").trim().toUpperCase();
  const country = String(formData.get("country") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const stadium = String(formData.get("stadium") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = await resolveImageUpload({
    formData,
    folder: "teams",
  });

  if (!name || !short || !country || !level || !stadium || !description) {
    redirectWithFormError(
      "/admin/teams",
      "Заповніть назву, коротку назву, країну, рівень, арену й опис команди.",
    );
  }

  const slugBase = createSlug(name);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.team.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  await prisma.team.create({
    data: {
      id: createTeamId(),
      slug,
      name,
      short,
      country,
      level,
      stadium,
      description,
      image,
    },
  });

  revalidatePath("/teams");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/teams");
  redirectWithFormSuccess("/admin/teams", "Команду успішно створено.");
}

export async function updateTeam(slug: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const short = String(formData.get("short") ?? "").trim().toUpperCase();
  const country = String(formData.get("country") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const stadium = String(formData.get("stadium") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const currentTeam = await prisma.team.findUnique({
    where: { slug },
    select: { image: true },
  });
  const image = await resolveImageUpload({
    formData,
    folder: "teams",
    fallbackImage: currentTeam?.image ?? "",
  });

  if (!name || !short || !country || !level || !stadium || !description) {
    redirectWithFormError(
      `/admin/teams/${slug}`,
      "Заповніть назву, коротку назву, країну, рівень, арену й опис команди.",
    );
  }

  await prisma.team.update({
    where: { slug },
    data: {
      name,
      short,
      country,
      level,
      stadium,
      description,
      image,
    },
  });

  revalidatePath("/teams");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/teams/${slug}`);
  revalidatePath("/admin/teams");
  revalidatePath(`/admin/teams/${slug}`);
  redirectWithFormSuccess("/admin/teams", "Зміни до команди збережено.");
}

export async function deleteTeam(slug: string) {
  await requireAdmin();

  await prisma.team.delete({
    where: { slug },
  });

  revalidatePath("/teams");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/teams/${slug}`);
  revalidatePath("/admin/teams");
  revalidatePath(`/admin/teams/${slug}`);
  redirect("/admin/teams");
}
