import { aggregateActivity, calculateFocusScore, calculateGoalAlignment, calculateProductivityScore, formatDuration } from "@lifeos/analytics";
import { ActivityEvent, Goal, ReportPeriod } from "@lifeos/shared";

export interface LifeReport {
  period: ReportPeriod;
  summary: string;
  productivityScore: number;
  focusScore: number;
  goalAlignmentScore: number;
  keyAchievements: string[];
  distractions: string[];
  recommendations: string[];
  learningTopics: string[];
}

export interface SearchInsight {
  query: string;
  topic: string;
  confidence: number;
}

const topicRules: Array<[RegExp, string]> = [
  [/supabase|postgres|prisma|sql|database|index|trigger/i, "Database Engineering"],
  [/next\.js|react|tailwind|typescript|frontend|css/i, "Frontend Engineering"],
  [/docker|kubernetes|coolify|vps|deploy|linux/i, "DevOps and Deployment"],
  [/fitness|sleep|nutrition|health/i, "Health Optimization"],
  [/marketing|sales|pricing|saas/i, "SaaS Growth"]
];

export function classifySearchTopic(query: string): SearchInsight {
  const match = topicRules.find(([rule]) => rule.test(query));
  return { query, topic: match?.[1] ?? "General Research", confidence: match ? 0.86 : 0.52 };
}

export function buildReportPrompt(period: ReportPeriod, events: ActivityEvent[], goals: Goal[]): string {
  const totals = aggregateActivity(events);
  const productivity = calculateProductivityScore(events);
  const focus = calculateFocusScore(events);
  const goalAlignment = calculateGoalAlignment(events, goals);
  return [
    `Create a ${period} LifeOS AI report.`,
    `Total tracked time: ${formatDuration(totals.totalSeconds)}.`,
    `Productivity score: ${productivity.score}. Focus score: ${focus.score}. Goal alignment: ${goalAlignment}.`,
    `Category totals: ${JSON.stringify(totals.byCategory)}.`,
    `Top apps: ${JSON.stringify(totals.byApp)}.`,
    `Top websites: ${JSON.stringify(totals.byDomain)}.`,
    `Goals: ${JSON.stringify(goals.map((goal) => ({ title: goal.title, targetCategory: goal.targetCategory, targetSecondsPerWeek: goal.targetSecondsPerWeek })))}.`,
    "Return concise JSON with summary, achievements, distractions, recommendations, and learningTopics."
  ].join("\n");
}

export async function runLifeReportWorkflow(input: { period: ReportPeriod; events: ActivityEvent[]; goals: Goal[] }): Promise<LifeReport> {
  const totals = aggregateActivity(input.events);
  const productivity = calculateProductivityScore(input.events);
  const focus = calculateFocusScore(input.events);
  const goalAlignmentScore = calculateGoalAlignment(input.events, input.goals);
  const topCategory = Object.entries(totals.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "uncategorized";
  const distractions = Object.entries(totals.byCategory).filter(([category, seconds]) => ["social", "entertainment", "shopping"].includes(category) && seconds > 0).map(([category, seconds]) => `${category}: ${formatDuration(seconds)}`);
  const learningTopics = input.events.flatMap((event) => typeof event.metadata.searchQuery === "string" ? [classifySearchTopic(event.metadata.searchQuery).topic] : []).filter((topic, index, array) => array.indexOf(topic) === index);

  return {
    period: input.period,
    summary: `You tracked ${formatDuration(totals.totalSeconds)} with ${topCategory} as the dominant activity category.`,
    productivityScore: productivity.score,
    focusScore: focus.score,
    goalAlignmentScore,
    keyAchievements: totals.byApp.slice(0, 3).map((app) => `Focused in ${app.name} for ${formatDuration(app.seconds)}`),
    distractions,
    recommendations: [
      focus.score < 70 ? "Batch shallow work and protect two 50-minute focus blocks tomorrow." : "Maintain the current focus rhythm with planned recovery breaks.",
      productivity.score < 70 ? "Reduce high-distraction categories during your first work session." : "Keep prioritizing development, learning, and productivity windows.",
      goalAlignmentScore < 80 ? "Review active goals and reserve calendar time for the lowest-aligned goal." : "Your behavior is strongly aligned with your active goals."
    ],
    learningTopics
  };
}
