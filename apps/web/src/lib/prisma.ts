import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error(`DATABASE_URL missing at runtime`);
    const sql = neon(url);
    const adapter = new PrismaNeon(sql as any);
    global.__prisma = new PrismaClient({ adapter } as any);
  }
  return global.__prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});