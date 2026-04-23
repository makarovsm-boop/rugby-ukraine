import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canAccessAdminPath,
  getDefaultAdminHref,
  isAdminRole,
} from "@/lib/roles";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !isAdminRole(user.role)) {
    redirect("/");
  }

  return user;
}

export async function requireEditorAccess(pathname: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !canAccessAdminPath(user.role, pathname)) {
    redirect(getDefaultAdminHref(user?.role));
  }

  return user;
}

export function parseTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function createArticleId() {
  return randomUUID();
}

export function createTeamId() {
  return randomUUID();
}

export function createPlayerId() {
  return randomUUID();
}

export function createChampionshipId() {
  return randomUUID();
}

export function createMatchId() {
  return randomUUID();
}

export function createUserId() {
  return randomUUID();
}
