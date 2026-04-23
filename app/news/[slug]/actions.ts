"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createComment(articleId: string, slug: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const content = String(formData.get("content") ?? "").trim();

  if (!session?.user?.email || content.length < 2) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return;
  }

  await prisma.comment.create({
    data: {
      id: randomUUID(),
      articleId,
      userId: user.id,
      content,
    },
  });

  revalidatePath(`/news/${slug}`);
}
