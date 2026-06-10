import { ActivityEvent, Goal } from "@lifeos/shared";

const base = new Date("2026-06-10T08:00:00.000Z").getTime();
export const goals: Goal[] = [{ id: "goal-build-saas", userId: "demo", title: "Build SaaS", description: "Prioritize coding and learning", targetCategory: "development", targetSecondsPerWeek: 64800, active: true }];
export const events: ActivityEvent[] = [
  { id: "1", userId: "demo", source: "desktop", category: "development", title: "LifeOS API", appName: "VS Code", startedAt: new Date(base).toISOString(), endedAt: new Date(base + 7200000).toISOString(), durationSeconds: 7200, metadata: {} },
  { id: "2", userId: "demo", source: "browser", category: "learning", title: "Prisma indexes", appName: "Arc", domain: "prisma.io", url: "https://www.prisma.io/docs", startedAt: new Date(base + 7200000).toISOString(), endedAt: new Date(base + 9000000).toISOString(), durationSeconds: 1800, metadata: { searchQuery: "Prisma migration PostgreSQL index" } },
  { id: "3", userId: "demo", source: "coding", category: "development", title: "GitHub commits", appName: "GitHub", domain: "github.com", startedAt: new Date(base + 9000000).toISOString(), endedAt: new Date(base + 12600000).toISOString(), durationSeconds: 3600, metadata: {} },
  { id: "4", userId: "demo", source: "browser", category: "communication", title: "Slack", appName: "Slack", domain: "slack.com", startedAt: new Date(base + 12600000).toISOString(), endedAt: new Date(base + 14400000).toISOString(), durationSeconds: 1800, metadata: {} },
  { id: "5", userId: "demo", source: "browser", category: "social", title: "X", appName: "Arc", domain: "x.com", startedAt: new Date(base + 14400000).toISOString(), endedAt: new Date(base + 16200000).toISOString(), durationSeconds: 1800, metadata: {} }
];
