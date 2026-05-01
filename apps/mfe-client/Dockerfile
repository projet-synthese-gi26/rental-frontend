# ─────────────────────────────────────────
# Stage 1 — Installer les dépendances
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps/container-shell/package.json   ./apps/container-shell/
COPY apps/mfe-agency/package.json        ./apps/mfe-agency/
COPY apps/mfe-client/package.json        ./apps/mfe-client/
COPY apps/mfe-organisation/package.json  ./apps/mfe-organisation/
COPY packages/shared-ui/package.json       ./packages/shared-ui/
COPY packages/shared-services/package.json ./packages/shared-services/

RUN npm ci


# ─────────────────────────────────────────
# Stage 2 — Builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les manifestes du monorepo
COPY package.json package-lock.json turbo.json ./

COPY --from=deps /app/node_modules ./node_modules

COPY packages/ ./packages/
COPY apps/mfe-client ./apps/mfe-client

# ── Variables d'environnement connues au BUILD ──
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npx turbo run build --filter=mfe-client


# ─────────────────────────────────────────
# Stage 3 — Runner
# ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/mfe-client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/mfe-client/.next/static     ./apps/mfe-client/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/mfe-client/public           ./apps/mfe-client/public

USER nextjs

EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/mfe-client/server.js"]
