import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getPrismaClientOptions } from "@/lib/prisma-adapter";
import {
  articlesSeed,
  championshipsSeed,
  commentsSeed,
  matchesSeed,
  playersSeed,
  teamsSeed,
  usersSeed,
} from "./seed-data";

const prisma = new PrismaClient(getPrismaClientOptions());

async function main() {
  await prisma.comment.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.article.deleteMany();
  await prisma.team.deleteMany();
  await prisma.championship.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: await Promise.all(
      usersSeed.map(async (user) => ({
        ...user,
        password: await hash(user.password, 10),
      })),
    ),
  });

  await prisma.championship.createMany({
    data: championshipsSeed,
  });

  await prisma.team.createMany({
    data: teamsSeed,
  });

  await prisma.player.createMany({
    data: playersSeed,
  });

  for (const article of articlesSeed) {
    await prisma.article.create({
      data: {
        ...article,
        date: new Date(article.date),
      },
    });
  }

  for (const match of matchesSeed) {
    await prisma.match.create({
      data: {
        ...match,
        date: new Date(match.date),
      },
    });
  }

  for (const comment of commentsSeed) {
    await prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date(comment.createdAt),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
