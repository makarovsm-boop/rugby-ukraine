"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import {
  redirectWithFormError,
  redirectWithFormSuccess,
} from "@/lib/admin-form-errors";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profilePath = "/profile";

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirectWithFormError(profilePath, "Щоб змінити пароль, потрібно увійти.");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirectWithFormError(profilePath, "Заповніть усі поля для зміни пароля.");
  }

  if (newPassword.length < 6) {
    redirectWithFormError(
      profilePath,
      "Новий пароль має містити щонайменше 6 символів.",
    );
  }

  if (newPassword !== confirmPassword) {
    redirectWithFormError(profilePath, "Підтвердження пароля не збігається.");
  }

  if (currentPassword === newPassword) {
    redirectWithFormError(
      profilePath,
      "Новий пароль має відрізнятися від поточного.",
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    redirectWithFormError(profilePath, "Користувача не знайдено.");
  }

  const isCurrentPasswordValid = await compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    redirectWithFormError(profilePath, "Поточний пароль вказано неправильно.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await hash(newPassword, 10),
    },
  });

  revalidatePath(profilePath);
  redirectWithFormSuccess(profilePath, "Пароль успішно оновлено.");
}
