# BASE IMAGE
FROM node:20-alpine as BASE

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# DEPENDENCY STAGE
FROM BASE AS DEPS

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# BUILD STAGE
FROM DEPS AS BUILD

COPY . .
RUN pnpm build

# PRODUCTION STAGE

FROM node:20-alpine as PROD

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]