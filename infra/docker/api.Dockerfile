FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* turbo.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @lifeos/api build
EXPOSE 4000
CMD ["pnpm", "--filter", "@lifeos/api", "start"]
