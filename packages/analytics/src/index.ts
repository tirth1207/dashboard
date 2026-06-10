import { ActivityEvent, ActivityCategory, Goal, ScoreBreakdown, clampScore } from "@lifeos/shared";

export interface ActivityTotals {
  totalSeconds: number;
  byCategory: Record<ActivityCategory, number>;
  byApp: Array<{ name: string; seconds: number }>;
  byDomain: Array<{ domain: string; seconds: number }>;
  timeline: Array<{ hour: string; category: ActivityCategory; seconds: number }>;
}

const emptyCategories = (): Record<ActivityCategory, number> => ({
  development: 0,
  learning: 0,
  social: 0,
  entertainment: 0,
  shopping: 0,
  productivity: 0,
  communication: 0,
  health: 0,
  finance: 0,
  system: 0,
  uncategorized: 0
});

function topEntries(map: Map<string, number>): Array<{ name: string; seconds: number }> {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, seconds]) => ({ name, seconds }));
}

export function aggregateActivity(events: ActivityEvent[]): ActivityTotals {
  const byCategory = emptyCategories();
  const apps = new Map<string, number>();
  const domains = new Map<string, number>();
  const timeline = new Map<string, { category: ActivityCategory; seconds: number }>();
  let totalSeconds = 0;

  for (const event of events) {
    totalSeconds += event.durationSeconds;
    byCategory[event.category] += event.durationSeconds;
    if (event.appName) apps.set(event.appName, (apps.get(event.appName) ?? 0) + event.durationSeconds);
    if (event.domain) domains.set(event.domain, (domains.get(event.domain) ?? 0) + event.durationSeconds);
    const hour = new Date(event.startedAt).toISOString().slice(0, 13) + ":00:00.000Z";
    const key = `${hour}:${event.category}`;
    const current = timeline.get(key) ?? { category: event.category, seconds: 0 };
    current.seconds += event.durationSeconds;
    timeline.set(key, current);
  }

  return {
    totalSeconds,
    byCategory,
    byApp: topEntries(apps),
    byDomain: [...domains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([domain, seconds]) => ({ domain, seconds })),
    timeline: [...timeline.entries()].map(([key, value]) => ({ hour: key.split(":").slice(0, 3).join(":"), ...value }))
  };
}

export function calculateProductivityScore(events: ActivityEvent[]): ScoreBreakdown {
  const productive = new Set<ActivityCategory>(["development", "learning", "productivity", "health", "finance"]);
  const negative = new Set<ActivityCategory>(["social", "entertainment", "shopping"]);
  const totals = aggregateActivity(events).byCategory;
  const positiveSeconds = Object.entries(totals).filter(([category]) => productive.has(category as ActivityCategory)).reduce((sum, [, seconds]) => sum + seconds, 0);
  const negativeSeconds = Object.entries(totals).filter(([category]) => negative.has(category as ActivityCategory)).reduce((sum, [, seconds]) => sum + seconds, 0);
  const neutralSeconds = Math.max(0, aggregateActivity(events).totalSeconds - positiveSeconds - negativeSeconds);
  const score = clampScore(((positiveSeconds + neutralSeconds * 0.45) / Math.max(1, positiveSeconds + neutralSeconds + negativeSeconds)) * 100);
  return { score, positiveSeconds, neutralSeconds, negativeSeconds, explanation: "Productive categories are weighted positively, neutral categories partially, and distractions negatively." };
}

export function calculateFocusScore(events: ActivityEvent[]): ScoreBreakdown {
  const longSessions = events.filter((event) => event.durationSeconds >= 25 * 60).reduce((sum, event) => sum + event.durationSeconds, 0);
  const contextSwitchPenalty = Math.min(35, Math.max(0, events.length - 12));
  const total = events.reduce((sum, event) => sum + event.durationSeconds, 0);
  const score = clampScore((longSessions / Math.max(1, total)) * 100 - contextSwitchPenalty + 25);
  return { score, positiveSeconds: longSessions, neutralSeconds: Math.max(0, total - longSessions), negativeSeconds: contextSwitchPenalty * 60, explanation: "Focus improves when work happens in longer uninterrupted sessions with fewer context switches." };
}

export function calculateGoalAlignment(events: ActivityEvent[], goals: Goal[]): number {
  const activeGoals = goals.filter((goal) => goal.active);
  if (activeGoals.length === 0) return 100;
  const totals = aggregateActivity(events).byCategory;
  const scores = activeGoals.map((goal) => clampScore((totals[goal.targetCategory] / Math.max(1, goal.targetSecondsPerWeek)) * 100));
  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
