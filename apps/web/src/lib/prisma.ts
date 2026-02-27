import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var __prisma: PrismaClient | undefined;
}

if (!global.__prisma) {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;
  if (!url) throw new Error("No database URL found in environment");
  const sql = neon(url);
  const adapter = new PrismaNeon(sql as any);
  global.__prisma = new PrismaClient({ adapter } as any);
}

export const prisma = global.__prisma;