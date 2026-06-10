CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "ActivitySource" AS ENUM ('desktop','browser','mobile','coding');
CREATE TYPE "ActivityCategory" AS ENUM ('development','learning','social','entertainment','shopping','productivity','communication','health','finance','system','uncategorized');
CREATE TYPE "ReportPeriod" AS ENUM ('daily','weekly','monthly','yearly');
CREATE TYPE "NotificationChannel" AS ENUM ('email','push','in_app');
CREATE TYPE "NotificationStatus" AS ENUM ('queued','sent','failed','read');

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "supabase_user_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "full_name" TEXT,
  "avatar_url" TEXT,
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "encryption_salt" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_supabase_user_id_key" ON "users"("supabase_user_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");

CREATE TABLE "devices" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "device_type" TEXT NOT NULL,
  "external_id" TEXT,
  "last_seen_at" TIMESTAMP(3),
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "devices_user_id_external_id_key" ON "devices"("user_id","external_id");
CREATE INDEX "devices_user_id_platform_idx" ON "devices"("user_id","platform");

CREATE TABLE "activity_logs" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "device_id" UUID,
  "source" "ActivitySource" NOT NULL,
  "category" "ActivityCategory" NOT NULL DEFAULT 'uncategorized',
  "title" TEXT NOT NULL,
  "app_name" TEXT,
  "window_title" TEXT,
  "domain" TEXT,
  "url" TEXT,
  "started_at" TIMESTAMP(3) NOT NULL,
  "ended_at" TIMESTAMP(3) NOT NULL,
  "duration_seconds" INTEGER NOT NULL,
  "idle_seconds" INTEGER NOT NULL DEFAULT 0,
  "encrypted_blob" BYTEA,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "activity_logs_user_id_started_at_idx" ON "activity_logs"("user_id","started_at");
CREATE INDEX "activity_logs_user_id_source_started_at_idx" ON "activity_logs"("user_id","source","started_at");
CREATE INDEX "activity_logs_user_id_category_started_at_idx" ON "activity_logs"("user_id","category","started_at");
CREATE INDEX "activity_logs_domain_idx" ON "activity_logs"("domain");

CREATE TABLE "website_logs" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "domain" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "title" TEXT,
  "category" "ActivityCategory" NOT NULL DEFAULT 'uncategorized',
  "started_at" TIMESTAMP(3) NOT NULL,
  "ended_at" TIMESTAMP(3) NOT NULL,
  "duration_seconds" INTEGER NOT NULL,
  "session_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "website_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "website_logs_user_id_started_at_idx" ON "website_logs"("user_id","started_at");
CREATE INDEX "website_logs_domain_started_at_idx" ON "website_logs"("domain","started_at");

CREATE TABLE "search_logs" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "engine" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "topic" TEXT,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "searched_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "search_logs_user_id_searched_at_idx" ON "search_logs"("user_id","searched_at");
CREATE INDEX "search_logs_topic_idx" ON "search_logs"("topic");

CREATE TABLE "app_usage" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "device_id" UUID,
  "app_name" TEXT NOT NULL,
  "bundle_id" TEXT,
  "category" "ActivityCategory" NOT NULL DEFAULT 'uncategorized',
  "started_at" TIMESTAMP(3) NOT NULL,
  "ended_at" TIMESTAMP(3) NOT NULL,
  "duration_seconds" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "app_usage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "app_usage_user_id_app_name_started_at_idx" ON "app_usage"("user_id","app_name","started_at");

CREATE TABLE "coding_sessions" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "provider" TEXT NOT NULL,
  "repository" TEXT NOT NULL,
  "project" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "branch" TEXT,
  "commits" INTEGER NOT NULL DEFAULT 0,
  "started_at" TIMESTAMP(3) NOT NULL,
  "ended_at" TIMESTAMP(3) NOT NULL,
  "duration_seconds" INTEGER NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "coding_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "coding_sessions_user_id_started_at_idx" ON "coding_sessions"("user_id","started_at");
CREATE INDEX "coding_sessions_repository_started_at_idx" ON "coding_sessions"("repository","started_at");

CREATE TABLE "goals" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "target_category" "ActivityCategory" NOT NULL,
  "target_seconds_per_week" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "goals_user_id_active_idx" ON "goals"("user_id","active");

CREATE TABLE "goal_progress" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "goal_id" UUID NOT NULL,
  "period_start" TIMESTAMP(3) NOT NULL,
  "period_end" TIMESTAMP(3) NOT NULL,
  "actual_seconds" INTEGER NOT NULL,
  "alignment_score" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "goal_progress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "goal_progress_goal_id_period_start_period_end_key" ON "goal_progress"("goal_id","period_start","period_end");
CREATE INDEX "goal_progress_user_id_period_start_idx" ON "goal_progress"("user_id","period_start");

CREATE TABLE "daily_reports" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "report_date" DATE NOT NULL,
  "summary" TEXT NOT NULL,
  "productivity_score" INTEGER NOT NULL,
  "focus_score" INTEGER NOT NULL,
  "goal_alignment" INTEGER NOT NULL,
  "payload" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "daily_reports_user_id_report_date_key" ON "daily_reports"("user_id","report_date");

CREATE TABLE "weekly_reports" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "week_start" DATE NOT NULL,
  "week_end" DATE NOT NULL,
  "summary" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "weekly_reports_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "weekly_reports_user_id_week_start_key" ON "weekly_reports"("user_id","week_start");

CREATE TABLE "monthly_reports" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "month_start" DATE NOT NULL,
  "summary" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "monthly_reports_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "monthly_reports_user_id_month_start_key" ON "monthly_reports"("user_id","month_start");

CREATE TABLE "yearly_reports" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "year" INTEGER NOT NULL,
  "summary" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "yearly_reports_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "yearly_reports_user_id_year_key" ON "yearly_reports"("user_id","year");

CREATE TABLE "notifications" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "channel" "NotificationChannel" NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'queued',
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "sent_at" TIMESTAMP(3),
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "notifications_user_id_status_created_at_idx" ON "notifications"("user_id","status","created_at");

CREATE TABLE "settings" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "settings_user_id_key_key" ON "settings"("user_id","key");

ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "website_logs" ADD CONSTRAINT "website_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "app_usage" ADD CONSTRAINT "app_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "app_usage" ADD CONSTRAINT "app_usage_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "coding_sessions" ADD CONSTRAINT "coding_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "weekly_reports" ADD CONSTRAINT "weekly_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "monthly_reports" ADD CONSTRAINT "monthly_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "yearly_reports" ADD CONSTRAINT "yearly_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
