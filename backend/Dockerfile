# BASE IMAGE
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# DEPENDENCY STAGE
FROM base AS deps
COPY package.json ./
RUN pnpm install

# BUILD STAGE
FROM deps AS build
COPY . .
RUN pnpm build

# PRODUCTION STAGE
FROM node:20-alpine AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
