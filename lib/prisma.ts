const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
function withAccelerate(): any {
  throw new Error("Function not implemented.");
}
