import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ActivityModule } from "./modules/activity/activity.module.js";
import { ReportsModule } from "./modules/reports/reports.module.js";
import { GoalsModule } from "./modules/goals/goals.module.js";
import { NotificationsModule } from "./modules/notifications/notifications.module.js";
import { PrismaService } from "./common/prisma.service.js";

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), ActivityModule, ReportsModule, GoalsModule, NotificationsModule], providers: [PrismaService], exports: [PrismaService] })
export class AppModule {}
