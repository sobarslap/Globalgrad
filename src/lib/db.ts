import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — avoids exhausting Neon connections during dev HMR.
 * Server-only. In production, logs are limited to errors (no query/PII logging).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
