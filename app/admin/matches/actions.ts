"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { createMatchId, requireAdmin } from "@/lib/admin";
import {
  buildEditorialMatchSignature,
  getEditorialMatchCards,
} from "@/lib/editorial-matches";
import { getChampionshipCanonicalSlug } from "@/lib/championship-data";
import { isMatchStatus } from "@/lib/match-status";
import { parseMatchTeams } from "@/lib/match-teams";
import { prisma } from "@/lib/prisma";

function parseOptionalScore(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function hasInvalidScoreValue(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return false;
  }

  const parsed = Number(raw);
  return !Number.isInteger(parsed) || parsed < 0;
}

function validateMatchInput(
  basePath: string,
  data: {
    championshipId: string;
    homeTeamId: string;
    awayTeamId: string;
    status: string;
    round: string;
    date: string;
    location: string;
    homeScore: number | null;
    awayScore: number | null;
    homeScoreValue: FormDataEntryValue | null;
    awayScoreValue: FormDataEntryValue | null;
  },
) {
  const {
    championshipId,
    homeTeamId,
    awayTeamId,
    status,
    round,
    date,
    location,
    homeScore,
    awayScore,
    homeScoreValue,
    awayScoreValue,
  } = data;

  if (
    !championshipId ||
    !homeTeamId ||
    !awayTeamId ||
    !status ||
    !round ||
    !date ||
    !location
  ) {
    redirectWithFormError(
      basePath,
      "Заповніть чемпіонат, обидві команди, статус, тур, дату і місце проведення.",
    );
  }

  if (!isMatchStatus(status)) {
    redirectWithFormError(basePath, "Вкажіть коректний статус матчу.");
  }

  if (homeTeamId === awayTeamId) {
    redirectWithFormError(
      basePath,
      "Домашня і гостьова команда мають бути різними.",
    );
  }

  if (Number.isNaN(new Date(date).getTime())) {
    redirectWithFormError(basePath, "Вкажіть коректні дату і час матчу.");
  }

  if (
    hasInvalidScoreValue(homeScoreValue) ||
    hasInvalidScoreValue(awayScoreValue)
  ) {
    redirectWithFormError(
      basePath,
      "Рахунок має бути цілим числом не менше нуля або залиште поле порожнім.",
    );
  }

  if ((homeScore === null) !== (awayScore === null)) {
    redirectWithFormError(
      basePath,
      "Для результату вкажіть обидва рахунки або залиште обидва поля порожніми.",
    );
  }

  if (status === "upcoming" && (homeScore !== null || awayScore !== null)) {
    redirectWithFormError(
      basePath,
      "Для upcoming-матчу залиште рахунок порожнім.",
    );
  }

  if (
    (status === "live" || status === "finished") &&
    (homeScore === null || awayScore === null)
  ) {
    redirectWithFormError(
      basePath,
      "Для live і finished потрібно вказати обидва рахунки.",
    );
  }
}

function revalidateMatchPages(id?: string) {
  revalidatePath("/championships");
  revalidatePath("/teams");
  revalidatePath("/");
  revalidatePath("/admin/matches");

  if (id) {
    revalidatePath(`/admin/matches/${id}`);
  }
}

export async function createMatch(formData: FormData) {
  await requireAdmin();

  const championshipId = String(formData.get("championshipId") ?? "").trim();
  const homeTeamId = String(formData.get("homeTeamId") ?? "").trim();
  const awayTeamId = String(formData.get("awayTeamId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const round = String(formData.get("round") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const homeScoreValue = formData.get("homeScore");
  const awayScoreValue = formData.get("awayScore");
  const homeScore = parseOptionalScore(homeScoreValue);
  const awayScore = parseOptionalScore(awayScoreValue);

  validateMatchInput("/admin/matches", {
    championshipId,
    homeTeamId,
    awayTeamId,
    status,
    round,
    date,
    location,
    homeScore,
    awayScore,
    homeScoreValue,
    awayScoreValue,
  });

  await prisma.match.create({
    data: {
      id: createMatchId(),
      championshipId,
      homeTeamId,
      awayTeamId,
      status,
      round,
      date: new Date(date),
      location,
      homeScore,
      awayScore,
    },
  });

  revalidateMatchPages();
  redirectWithFormSuccess("/admin/matches", "Матч успішно створено.");
}

function normalizeLookupValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

export async function importEditorialMatch(editorialId: string) {
  await requireAdmin();

  const editorialMatch = getEditorialMatchCards().find(
    (match) => match.id === editorialId,
  );

  if (!editorialMatch) {
    redirectWithFormError(
      "/admin/matches",
      "Не вдалося знайти редакційний матч для імпорту.",
    );
  }

  const parsedTeams =
    editorialMatch.parsedTeams ?? parseMatchTeams(editorialMatch.teams);

  if (!parsedTeams) {
    redirectWithFormError(
      "/admin/matches",
      "Не вдалося розібрати пари команд у редакційному матчі.",
    );
  }

  const championship = await prisma.championship.findFirst({
    where: {
      OR: [
        { slug: editorialMatch.championshipSlug },
        { title: editorialMatch.championshipTitle },
        {
          slug: getChampionshipCanonicalSlug({
            slug: editorialMatch.championshipSlug,
            title: editorialMatch.championshipTitle,
          }),
        },
      ],
    },
  });

  if (!championship) {
    redirectWithFormError(
      "/admin/matches",
      "Спочатку додайте відповідний чемпіонат у адмінку, а потім імпортуйте матч.",
    );
  }

  const teams = await prisma.team.findMany({
    where: {
      OR: [{ name: parsedTeams.homeName }, { name: parsedTeams.awayName }],
    },
  });

  const homeTeam = teams.find(
    (team) =>
      normalizeLookupValue(team.name) ===
      normalizeLookupValue(parsedTeams.homeName),
  );
  const awayTeam = teams.find(
    (team) =>
      normalizeLookupValue(team.name) ===
      normalizeLookupValue(parsedTeams.awayName),
  );

  if (!homeTeam || !awayTeam) {
    redirectWithFormError(
      "/admin/matches",
      "Спочатку додайте обидві команди в адмінку, а потім імпортуйте матч.",
    );
  }

  const existingMatches = await prisma.match.findMany({
    include: {
      championship: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  const targetSignature = buildEditorialMatchSignature({
    championshipSlug: championship.slug,
    round: editorialMatch.round,
    homeName: parsedTeams.homeName,
    awayName: parsedTeams.awayName,
  });

  const duplicate = existingMatches.find((match) => {
    const signature = buildEditorialMatchSignature({
      championshipSlug: match.championship.slug,
      round: match.round,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
    });

    return signature === targetSignature;
  });

  if (duplicate) {
    redirectWithFormSuccess(
      "/admin/matches",
      "Такий матч уже є в адмінці і доступний для редагування.",
    );
  }

  await prisma.match.create({
    data: {
      id: createMatchId(),
      championshipId: championship.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      status: editorialMatch.status,
      round: editorialMatch.round,
      date: editorialMatch.parsedDate ?? new Date(),
      location: editorialMatch.venueText,
      homeScore: parsedTeams.homeScore,
      awayScore: parsedTeams.awayScore,
    },
  });

  revalidateMatchPages();
  redirectWithFormSuccess(
    "/admin/matches",
    "Редакційний матч додано в адмінку. Тепер його можна редагувати або видаляти.",
  );
}

export async function updateMatch(id: string, formData: FormData) {
  await requireAdmin();

  const championshipId = String(formData.get("championshipId") ?? "").trim();
  const homeTeamId = String(formData.get("homeTeamId") ?? "").trim();
  const awayTeamId = String(formData.get("awayTeamId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const round = String(formData.get("round") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const homeScoreValue = formData.get("homeScore");
  const awayScoreValue = formData.get("awayScore");
  const homeScore = parseOptionalScore(homeScoreValue);
  const awayScore = parseOptionalScore(awayScoreValue);

  validateMatchInput(`/admin/matches/${id}`, {
    championshipId,
    homeTeamId,
    awayTeamId,
    status,
    round,
    date,
    location,
    homeScore,
    awayScore,
    homeScoreValue,
    awayScoreValue,
  });

  await prisma.match.update({
    where: { id },
    data: {
      championshipId,
      homeTeamId,
      awayTeamId,
      status,
      round,
      date: new Date(date),
      location,
      homeScore,
      awayScore,
    },
  });

  revalidateMatchPages(id);
  redirectWithFormSuccess("/admin/matches", "Зміни до матчу збережено.");
}

export async function deleteMatch(id: string) {
  await requireAdmin();

  await prisma.match.delete({
    where: { id },
  });

  revalidateMatchPages(id);
  redirect("/admin/matches");
}
