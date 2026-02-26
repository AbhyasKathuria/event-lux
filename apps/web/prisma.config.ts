import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!global.__prisma) {
      const url = process.env.DATABASE_URL;
      if (!url) throw new Error(`DATABASE_URL is not set. prop=${String(prop)}`);
      const sql = neon(url);
      const adapter = new PrismaNeon(sql as any);
      global.__prisma = new PrismaClient({ adapter } as any);
    }
    const value = (global.__prisma as any)[prop];
    if (typeof value === "function") {
      return value.bind(global.__prisma);
    }
    return value;
  },
});