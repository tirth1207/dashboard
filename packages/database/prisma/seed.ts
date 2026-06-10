import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@lifeos.ai" },
    update: {},
    create: {
      supabaseUserId: "00000000-0000-4000-8000-000000000001",
      email: "demo@lifeos.ai",
      fullName: "Demo Founder",
      timezone: "America/New_York",
      encryptionSalt: "demo-development-salt"
    }
  });

  const device = await prisma.device.upsert({
    where: { userId_externalId: { userId: user.id, externalId: "demo-macbook" } },
    update: { lastSeenAt: new Date() },
    create: { userId: user.id, externalId: "demo-macbook", name: "Demo MacBook Pro", platform: "macOS", deviceType: "desktop", lastSeenAt: new Date() }
  });

  const now = new Date();
  const startedAt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  await prisma.activityLog.createMany({
    data: [
      { userId: user.id, deviceId: device.id, source: "desktop", category: "development", title: "VS Code - LifeOS", appName: "Visual Studio Code", windowTitle: "LifeOS AI", startedAt, endedAt: new Date(startedAt.getTime() + 7200_000), durationSeconds: 7200 },
      { userId: user.id, deviceId: device.id, source: "browser", category: "learning", title: "Supabase trigger docs", appName: "Arc", domain: "supabase.com", url: "https://supabase.com/docs", startedAt: new Date(startedAt.getTime() + 7200_000), endedAt: new Date(startedAt.getTime() + 9000_000), durationSeconds: 1800 },
      { userId: user.id, deviceId: device.id, source: "browser", category: "social", title: "X", appName: "Arc", domain: "x.com", url: "https://x.com", startedAt: new Date(startedAt.getTime() + 9000_000), endedAt: now, durationSeconds: 1800 }
    ],
    skipDuplicates: true
  });

  await prisma.goal.upsert({
    where: { id: "00000000-0000-4000-8000-000000000101" },
    update: {},
    create: { id: "00000000-0000-4000-8000-000000000101", userId: user.id, title: "Build SaaS", description: "Spend meaningful weekly time coding and learning for LifeOS AI.", targetCategory: "development", targetSecondsPerWeek: 18 * 3600, active: true }
  });
}

main().finally(async () => prisma.$disconnect());
