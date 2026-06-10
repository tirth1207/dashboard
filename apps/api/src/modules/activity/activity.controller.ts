import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ActivityService } from "./activity.service.js";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}
  @Post("ingest") ingest(@Body() body: Parameters<ActivityService["ingest"]>[0]) { return this.activity.ingest(body); }
  @Get(":userId/recent") recent(@Param("userId") userId: string) { return this.activity.recent(userId); }
}
