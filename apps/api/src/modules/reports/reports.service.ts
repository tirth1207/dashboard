import { Injectable } from "@nestjs/common";
import { runLifeReportWorkflow } from "@lifeos/ai";
import { PrismaService } from "../../common/prisma.service.js";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}
  async generateDaily(userId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [activity, goals] = await Promise.all([this.prisma.activityLog.findMany({ where: { userId, startedAt: { gte: since } } }), this.prisma.goal.findMany({ where: { userId, active: true } })]);
    const report = await runLifeReportWorkflow({ period: "daily", events: activity.map((event) => ({ id: event.id, userId: event.userId, ...(event.deviceId ? { deviceId: event.deviceId } : {}), source: event.source, category: event.category, title: event.title, ...(event.appName ? { appName: event.appName } : {}), ...(event.domain ? { domain: event.domain } : {}), ...(event.url ? { url: event.url } : {}), startedAt: event.startedAt.toISOString(), endedAt: event.endedAt.toISOString(), durationSeconds: event.durationSeconds, metadata: event.metadata as Record<string, unknown> })), goals: goals.map((goal) => ({ id: goal.id, userId: goal.userId, title: goal.title, description: goal.description, targetCategory: goal.targetCategory, targetSecondsPerWeek: goal.targetSecondsPerWeek, active: goal.active })) });
    return this.prisma.dailyReport.upsert({ where: { userId_reportDate: { userId, reportDate: new Date(new Date().toISOString().slice(0, 10)) } }, update: { summary: report.summary, productivityScore: report.productivityScore, focusScore: report.focusScore, goalAlignment: report.goalAlignmentScore, payload: report }, create: { userId, reportDate: new Date(new Date().toISOString().slice(0, 10)), summary: report.summary, productivityScore: report.productivityScore, focusScore: report.focusScore, goalAlignment: report.goalAlignmentScore, payload: report } });
  }
}
