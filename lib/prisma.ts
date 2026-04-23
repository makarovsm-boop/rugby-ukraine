import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { getPrismaClientOptions } from "@/lib/prisma-adapter";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ??
  new PrismaClient(getPrismaClientOptions());

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
