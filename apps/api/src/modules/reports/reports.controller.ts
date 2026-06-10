import { Controller, Param, Post } from "@nestjs/common";
import { ReportsService } from "./reports.service.js";

@Controller("reports")
export class ReportsController { constructor(private readonly reports: ReportsService) {} @Post(":userId/daily") daily(@Param("userId") userId: string) { return this.reports.generateDaily(userId); } }
