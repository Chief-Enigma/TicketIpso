# -------- Builder --------
FROM node:20-bullseye AS builder
WORKDIR /app

# Build argument for monorepo compatibility (default: ticketing-system)
ARG APP_DIR=ticketing-system
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only package files first for better caching
COPY ./package*.json ./
RUN npm ci

# Copy remaining source code
COPY ./ ./

# Generate Prisma Client
RUN npx prisma generate || true

# Build Next.js app
RUN npm run build


# -------- Runner --------
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80

# Copy only necessary runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma

# Entrypoint: run migrations, then start app
RUN printf '%s\n' \
  '#!/usr/bin/env sh' \
  'set -e' \
  'echo "[entrypoint] running prisma migrate deploy..."' \
  'npx prisma migrate deploy || true' \
  'echo "[entrypoint] starting app..."' \
  'npm run start' > /entrypoint.sh \
  && chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]
