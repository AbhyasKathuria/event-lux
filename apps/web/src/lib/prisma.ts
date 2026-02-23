import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;
  const sql = neon(connectionString);
  
  // The FIX: Cast 'sql' to any to bypass the NeonQueryFunction type mismatch
  const adapter = new PrismaNeon(sql as any);
  
  // We use the standard PrismaClient with the adapter for Vercel/Serverless
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;