"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { resolveImageUpload } from "@/lib/uploads";
import { createPlayerId, createSlug, requireAdmin } from "@/lib/admin";

export async function createPlayer(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const number = Number(formData.get("number") ?? 0);
  const age = Number(formData.get("age") ?? 0);
  const height = String(formData.get("height") ?? "").trim();
  const weight = String(formData.get("weight") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const teamId = String(formData.get("teamId") ?? "").trim();
  const image = await resolveImageUpload({
    formData,
    folder: "players",
  });

  if (
    !name ||
    !position ||
    !Number.isInteger(number) ||
    number <= 0 ||
    !Number.isInteger(age) ||
    age <= 0 ||
    !height ||
    !weight ||
    !summary ||
    !bio ||
    !teamId
  ) {
    redirectWithFormError(
      "/admin/players",
      "Заповніть ім'я, команду, позицію, номер, вік, зріст, вагу, короткий опис і профіль гравця.",
    );
  }

  const slugBase = createSlug(name);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.player.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  await prisma.player.create({
    data: {
      id: createPlayerId(),
      slug,
      name,
      position,
      number,
      age,
      height,
      weight,
      summary,
      bio,
      image,
      teamId,
    },
  });

  revalidatePath("/players");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/teams");
  revalidatePath("/admin/players");
  redirectWithFormSuccess("/admin/players", "Гравця успішно створено.");
}

export async function updatePlayer(slug: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const number = Number(formData.get("number") ?? 0);
  const age = Number(formData.get("age") ?? 0);
  const height = String(formData.get("height") ?? "").trim();
  const weight = String(formData.get("weight") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const teamId = String(formData.get("teamId") ?? "").trim();
  const currentPlayer = await prisma.player.findUnique({
    where: { slug },
    select: { image: true },
  });
  const image = await resolveImageUpload({
    formData,
    folder: "players",
    fallbackImage: currentPlayer?.image ?? "",
  });

  if (
    !name ||
    !position ||
    !Number.isInteger(number) ||
    number <= 0 ||
    !Number.isInteger(age) ||
    age <= 0 ||
    !height ||
    !weight ||
    !summary ||
    !bio ||
    !teamId
  ) {
    redirectWithFormError(
      `/admin/players/${slug}`,
      "Заповніть ім'я, команду, позицію, номер, вік, зріст, вагу, короткий опис і профіль гравця.",
    );
  }

  await prisma.player.update({
    where: { slug },
    data: {
      name,
      position,
      number,
      age,
      height,
      weight,
      summary,
      bio,
      image,
      teamId,
    },
  });

  revalidatePath("/players");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/teams");
  revalidatePath(`/players/${slug}`);
  revalidatePath("/admin/players");
  revalidatePath(`/admin/players/${slug}`);
  redirectWithFormSuccess("/admin/players", "Зміни до гравця збережено.");
}

export async function deletePlayer(slug: string) {
  await requireAdmin();

  await prisma.player.delete({
    where: { slug },
  });

  revalidatePath("/players");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/teams");
  revalidatePath(`/players/${slug}`);
  revalidatePath("/admin/players");
  revalidatePath(`/admin/players/${slug}`);
  redirect("/admin/players");
}
