import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var __prisma: PrismaClient | undefined;
}

if (!global.__prisma) {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  const adapter = new PrismaNeon(sql as any);
  global.__prisma = new PrismaClient({ adapter } as any);
}

export const prisma = global.__prisma;