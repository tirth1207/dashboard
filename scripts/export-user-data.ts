import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userId = process.argv[2];
if (!userId) throw new Error("Usage: tsx scripts/export-user-data.ts <user-id>");
const data = await prisma.user.findUnique({ where: { id: userId }, include: { devices: true, activityLogs: true, websiteLogs: true, searchLogs: true, appUsage: true, codingSessions: true, goals: true, goalProgress: true, dailyReports: true, weeklyReports: true, monthlyReports: true, yearlyReports: true, notifications: true, settings: true } });
console.log(JSON.stringify(data, null, 2));
await prisma.$disconnect();
