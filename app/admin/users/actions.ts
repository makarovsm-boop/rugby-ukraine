"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createUserId,
  requireAdmin,
} from "@/lib/admin";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { prisma } from "@/lib/prisma";
import { isAppRole, normalizeRole } from "@/lib/roles";

const usersPath = "/admin/users";

function revalidateUserPaths() {
  revalidatePath(usersPath);
}

export async function createUser(formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const rawRole = String(formData.get("role") ?? "").trim().toUpperCase();

  if (!name || !email || !password) {
    redirectWithFormError(
      usersPath,
      "Заповніть ім'я, email, стартовий пароль і роль користувача.",
    );
  }

  if (!email.includes("@")) {
    redirectWithFormError(usersPath, "Вкажіть коректний email користувача.");
  }

  if (password.length < 6) {
    redirectWithFormError(
      usersPath,
      "Стартовий пароль має містити щонайменше 6 символів.",
    );
  }

  if (!isAppRole(rawRole)) {
    redirectWithFormError(usersPath, "Оберіть коректну роль користувача.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    redirectWithFormError(
      usersPath,
      "Користувач з таким email вже існує.",
    );
  }

  await prisma.user.create({
    data: {
      id: createUserId(),
      name,
      email,
      password: await hash(password, 10),
      role: rawRole,
    },
  });

  revalidateUserPaths();
  redirectWithFormSuccess(
    usersPath,
    `Користувача ${name} створено адміном ${admin.name}.`,
  );
}

export async function updateUserRole(userId: string, formData: FormData) {
  const admin = await requireAdmin();
  const rawRole = String(formData.get("role") ?? "").trim().toUpperCase();

  if (!isAppRole(rawRole)) {
    redirectWithFormError(usersPath, "Оберіть коректну роль користувача.");
  }

  if (admin.id === userId && rawRole !== "ADMIN") {
    redirectWithFormError(
      usersPath,
      "Ви не можете зняти роль ADMIN із власного акаунта в цьому розділі.",
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: normalizeRole(rawRole),
    },
  });

  revalidateUserPaths();
  redirectWithFormSuccess(usersPath, "Роль користувача оновлено.");
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    redirectWithFormError(
      usersPath,
      "Не можна видалити власний акаунт із цього розділу.",
    );
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidateUserPaths();
  redirect(usersPath);
}
