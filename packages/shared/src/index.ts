export type ActivitySource = "desktop" | "browser" | "mobile" | "coding";
export type ActivityCategory = "development" | "learning" | "social" | "entertainment" | "shopping" | "productivity" | "communication" | "health" | "finance" | "system" | "uncategorized";
export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface ActivityEvent {
  id: string;
  userId: string;
  deviceId?: string;
  source: ActivitySource;
  category: ActivityCategory;
  title: string;
  appName?: string;
  domain?: string;
  url?: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  metadata: Record<string, unknown>;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetCategory: ActivityCategory;
  targetSecondsPerWeek: number;
  active: boolean;
}

export interface ScoreBreakdown {
  score: number;
  positiveSeconds: number;
  neutralSeconds: number;
  negativeSeconds: number;
  explanation: string;
}

const domainCategoryRules: Array<[RegExp, ActivityCategory]> = [
  [/github|gitlab|stackoverflow|developer\.mozilla|docs\.|npmjs|vercel|supabase|prisma/i, "development"],
  [/coursera|udemy|khanacademy|wikipedia|medium|substack|youtube\.com\/watch/i, "learning"],
  [/twitter|x\.com|facebook|instagram|tiktok|reddit/i, "social"],
  [/netflix|hulu|disney|primevideo|twitch/i, "entertainment"],
  [/amazon|shopify|etsy|ebay/i, "shopping"],
  [/gmail|slack|discord|teams|zoom/i, "communication"],
  [/notion|linear|asana|trello|calendar|docs\.google/i, "productivity"]
];

export function categorizeDomain(domainOrUrl: string): ActivityCategory {
  const match = domainCategoryRules.find(([rule]) => rule.test(domainOrUrl));
  return match?.[1] ?? "uncategorized";
}

export function extractSearchQuery(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (["google.com", "bing.com", "duckduckgo.com", "youtube.com"].some((domain) => host.endsWith(domain))) {
      return parsed.searchParams.get("q") ?? parsed.searchParams.get("search_query");
    }
    return null;
  } catch {
    return null;
  }
}

export function secondsBetween(startedAt: Date, endedAt: Date): number {
  return Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
