import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!global.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    const sql = neon(connectionString);
    const adapter = new PrismaNeon(sql as any);
    global.prisma = new PrismaClient({ adapter } as any);
  }
  return global.prisma;
}

export const prisma = {
  get user() { return getPrisma().user; },
  get event() { return getPrisma().event; },
  get registration() { return getPrisma().registration; },
  get university() { return getPrisma().university; },
  get googleSheetSync() { return getPrisma().googleSheetSync; },
};