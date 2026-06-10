FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* turbo.json tsconfig.base.json ./
COPY apps/dashboard ./apps/dashboard
COPY packages ./packages
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @lifeos/dashboard build
EXPOSE 3000
CMD ["pnpm", "--filter", "@lifeos/dashboard", "start"]
