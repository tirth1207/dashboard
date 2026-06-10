import { Controller, Get, Param, Patch } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service.js";
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get(":userId") list(@Param("userId") userId: string) { return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }); }
  @Patch(":id/read") markRead(@Param("id") id: string) { return this.prisma.notification.update({ where: { id }, data: { status: "read", readAt: new Date() } }); }
}
