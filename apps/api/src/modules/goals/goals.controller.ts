import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service.js";
@Controller("goals")
export class GoalsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get(":userId") list(@Param("userId") userId: string) { return this.prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }); }
  @Post() create(@Body() body: { userId: string; title: string; description: string; targetCategory: any; targetSecondsPerWeek: number }) { return this.prisma.goal.create({ data: { ...body, active: true } }); }
}
