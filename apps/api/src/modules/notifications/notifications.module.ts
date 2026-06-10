import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller.js";
import { PrismaService } from "../../common/prisma.service.js";
@Module({ controllers: [NotificationsController], providers: [PrismaService] })
export class NotificationsModule {}
