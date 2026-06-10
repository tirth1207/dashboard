# LifeOS AI

LifeOS AI is a privacy-first personal analytics SaaS that tracks desktop, browser, mobile, and coding activity to answer how time is actually spent and whether behavior aligns with user goals.

## Monorepo

- `apps/dashboard` — Next.js App Router analytics dashboard with dark glassmorphism UI.
- `apps/api` — NestJS API for ingestion, goals, notifications, and report generation.
- `apps/desktop-agent` — Tauri v2 desktop agent with local-first active-window capture surface.
- `apps/browser-extension` — Manifest V3 extension tracking active tabs and queued local events.
- `apps/mobile` — Expo app for mobile dashboard, goals, insights, and platform usage permissions.
- `packages/database` — Prisma schema, migrations, seed data, and database client.
- `packages/analytics` — Aggregation and scoring engine.
- `packages/ai` — LangGraph-ready report workflows and learning topic classification.
- `packages/shared` — Shared types, categorization, and search parsing.
- `packages/ui` — Shared dashboard UI primitives.
- `infra/docker` — Docker and Compose deployment support for VPS and Coolify.

## Local development

```bash
cp .env.example .env
pnpm install
pnpm db:generate
docker compose -f infra/docker/docker-compose.yml up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Production deployment

1. Create managed Supabase Auth project and PostgreSQL database or run the bundled PostgreSQL service on a VPS.
2. Set every variable from `.env.example` in Coolify or your container platform.
3. Build the dashboard and API images from `infra/docker/dashboard.Dockerfile` and `infra/docker/api.Dockerfile`.
4. Run `pnpm --filter @lifeos/database db:migrate` during release.
5. Point `WEB_ORIGIN` at the dashboard origin and `NEXT_PUBLIC_API_URL` at the API origin.
6. Configure Supabase Google and email providers, then add dashboard callback URLs.
7. Schedule daily, weekly, monthly, and yearly report jobs against the API report endpoints.
8. Keep export and delete scripts available for privacy requests.

## Privacy model

LifeOS AI stores agent data locally first, queues sync in the background, models encrypted blobs in the activity schema, supports self-hosting, and includes scripts to export or delete all user-owned data.
