"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireEditorAccess } from "@/lib/admin";

export async function deleteComment(id: string, articleSlug: string) {
  await requireEditorAccess("/admin/comments");

  await prisma.comment.delete({
    where: { id },
  });

  revalidatePath("/admin/comments");
  revalidatePath(`/news/${articleSlug}`);
  revalidatePath("/news");
  redirect("/admin/comments");
}
