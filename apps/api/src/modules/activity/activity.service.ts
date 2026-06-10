import { Injectable } from "@nestjs/common";
import { categorizeDomain, extractSearchQuery } from "@lifeos/shared";
import { PrismaService } from "../../common/prisma.service.js";

interface IngestActivityInput { userId: string; deviceId?: string; source: "desktop" | "browser" | "mobile" | "coding"; title: string; appName?: string; domain?: string; url?: string; startedAt: string; endedAt: string; durationSeconds: number; metadata?: Record<string, unknown>; }

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async ingest(input: IngestActivityInput) {
    const category = input.domain || input.url ? categorizeDomain(input.domain ?? input.url ?? "") : "uncategorized";
    const log = await this.prisma.activityLog.create({ data: { userId: input.userId, deviceId: input.deviceId, source: input.source, category, title: input.title, appName: input.appName, domain: input.domain, url: input.url, startedAt: new Date(input.startedAt), endedAt: new Date(input.endedAt), durationSeconds: input.durationSeconds, metadata: input.metadata ?? {} } });
    const query = input.url ? extractSearchQuery(input.url) : null;
    if (query) await this.prisma.searchLog.create({ data: { userId: input.userId, engine: new URL(input.url!).hostname, query, searchedAt: new Date(input.startedAt) } });
    return log;
  }

  async recent(userId: string) { return this.prisma.activityLog.findMany({ where: { userId }, orderBy: { startedAt: "desc" }, take: 100 }); }
}
