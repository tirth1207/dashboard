import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userId = process.argv[2];
if (!userId) throw new Error("Usage: tsx scripts/delete-user-data.ts <user-id>");
await prisma.user.delete({ where: { id: userId } });
await prisma.$disconnect();
