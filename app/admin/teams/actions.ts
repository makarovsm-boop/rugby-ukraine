"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { getBathSquadWithSlug } from "@/lib/bath-squad";
import { fetchBathMenPlayersFromApi } from "@/lib/bath-squad-api";
import { getEditorialTeams } from "@/lib/editorial-teams";
import { resolveImageUpload, UploadStorageError } from "@/lib/uploads";
import {
  createPlayerId,
  createSlug,
  createTeamId,
  requireAdmin,
} from "@/lib/admin";

export async function createTeam(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const short = String(formData.get("short") ?? "").trim().toUpperCase();
  const country = String(formData.get("country") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const stadium = String(formData.get("stadium") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "teams",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError("/admin/teams", error.message);
    }

    throw error;
  }

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

export async function importEditorialTeam(editorialId: string) {
  await requireAdmin();

  const editorialTeam = getEditorialTeams().find((team) => team.id === editorialId);

  if (!editorialTeam) {
    redirectWithFormError(
      "/admin/teams",
      "Не вдалося знайти редакційну команду для імпорту.",
    );
  }

  const slugBase = createSlug(editorialTeam.name);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.team.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  const existingByName = await prisma.team.findFirst({
    where: { name: editorialTeam.name },
  });

  if (existingByName) {
    redirectWithFormSuccess(
      "/admin/teams",
      "Така команда вже є в адмінці і доступна для редагування.",
    );
  }

  await prisma.team.create({
    data: {
      id: createTeamId(),
      slug,
      name: editorialTeam.name,
      short: editorialTeam.short,
      country: editorialTeam.country,
      level: editorialTeam.level,
      stadium: editorialTeam.stadium,
      description: editorialTeam.description,
      image: editorialTeam.image,
    },
  });

  revalidatePath("/teams");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/teams");
  redirectWithFormSuccess(
    "/admin/teams",
    "Редакційну команду додано в адмінку. Тепер її можна редагувати або видаляти.",
  );
}

export async function importBathSquadPlayers() {
  await requireAdmin();

  const bathTeam = await prisma.team.findFirst({
    where: {
      OR: [{ name: "Bath Rugby" }, { slug: "bath-rugby" }],
    },
    select: { id: true },
  });

  if (!bathTeam) {
    redirectWithFormError(
      "/admin/teams",
      "Спочатку додайте команду Bath Rugby у розділ Команди, а потім імпортуйте склад.",
    );
  }

  const fallbackSquad = getBathSquadWithSlug();
  const existingPlayers = await prisma.player.findMany({
    where: { teamId: bathTeam.id },
    select: { id: true, slug: true },
  });
  const existingBySlug = new Map(existingPlayers.map((player) => [player.slug, player]));
  const existingCount = existingPlayers.length;

  let created = 0;
  let updated = 0;

  let sourcePlayers: Array<{
    slug: string;
    name: string;
    position: string;
    image: string;
    age: number;
    height: string;
    weight: string;
  }> = [];

  try {
    sourcePlayers = await fetchBathMenPlayersFromApi();
  } catch {
    sourcePlayers = fallbackSquad.map((player) => ({
      ...player,
      age: 25,
      height: "Н/Д",
      weight: "Н/Д",
    }));
  }

  for (const [index, player] of sourcePlayers.entries()) {
    const existing = existingBySlug.get(player.slug);

    if (existing) {
      await prisma.player.update({
        where: { id: existing.id },
        data: {
          name: player.name,
          position: player.position,
          image: player.image,
          age: player.age,
          height: player.height,
          weight: player.weight,
          summary: `${player.position} Bath Rugby`,
          bio: `Гравець Bath Rugby. Дані додані з офіційного списку складу клубу.`,
        },
      });
      updated += 1;
      continue;
    }

    await prisma.player.create({
      data: {
        id: createPlayerId(),
        slug: player.slug,
        name: player.name,
        position: player.position,
        number: existingCount + created + index + 1,
        age: player.age,
        height: player.height,
        weight: player.weight,
        summary: `${player.position} Bath Rugby`,
        bio: `Гравець Bath Rugby. Дані додані з офіційного списку складу клубу.`,
        image: player.image,
        teamId: bathTeam.id,
      },
    });

    created += 1;
  }

  revalidatePath("/teams");
  revalidatePath("/players");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/players");
  revalidatePath("/");

  if (created === 0 && updated === 0) {
    redirectWithFormSuccess(
      "/admin/teams",
      "Склад Bath Rugby уже імпортовано раніше. Нових гравців не додано.",
    );
  }

  redirectWithFormSuccess(
    "/admin/teams",
    `Склад Bath Rugby синхронізовано: додано ${created}, оновлено ${updated} гравців.`,
  );
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
  let image: string;

  try {
    image = await resolveImageUpload({
      formData,
      folder: "teams",
      fallbackImage: currentTeam?.image ?? "",
    });
  } catch (error) {
    if (error instanceof UploadStorageError) {
      redirectWithFormError(`/admin/teams/${slug}`, error.message);
    }

    throw error;
  }

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
