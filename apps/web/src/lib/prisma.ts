import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var prismaClient: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (!global.prismaClient) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not defined");
    const sql = neon(url);
    const adapter = new PrismaNeon(sql as any);
    global.prismaClient = new PrismaClient({ adapter } as any);
  }
  return global.prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});
