const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";


import "dotenv/config";

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// function withAccelerate(): any {
//   // Placeholder extension - previously threw not implemented error
//   // If you need to add Prisma middleware or extensions, implement here.
//   return {};
// }

