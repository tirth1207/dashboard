import { Module } from "@nestjs/common";
import { GoalsController } from "./goals.controller.js";
import { PrismaService } from "../../common/prisma.service.js";
@Module({ controllers: [GoalsController], providers: [PrismaService] })
export class GoalsModule {}
