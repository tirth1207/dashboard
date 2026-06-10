import { Module } from "@nestjs/common";
import { ActivityController } from "./activity.controller.js";
import { ActivityService } from "./activity.service.js";
import { PrismaService } from "../../common/prisma.service.js";

@Module({ controllers: [ActivityController], providers: [ActivityService, PrismaService] })
export class ActivityModule {}
