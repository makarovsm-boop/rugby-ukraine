import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Prisma } from "@prisma/client";

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getPrismaDatabaseUrl() {
  return getDatabaseUrl();
}

export function getPrismaClientOptions(): Prisma.PrismaClientOptions {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required after the Postgres switch. Set a valid postgres connection string before running the app.",
    );
  }

  if (
    !databaseUrl.startsWith("postgres://") &&
    !databaseUrl.startsWith("postgresql://")
  ) {
    throw new Error(
      'The project is now configured for Postgres. DATABASE_URL must start with "postgresql://" or "postgres://".',
    );
  }

  return {
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }) as NonNullable<Prisma.PrismaClientOptions["adapter"]>,
  };
}
