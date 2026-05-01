# ─────────────────────────────────────────
# Stage 1 — Installer les dépendances
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copier les manifestes du monorepo
COPY package.json package-lock.json turbo.json ./

# Copier les package.json de toutes les apps et packages
COPY apps/container-shell/package.json ./apps/container-shell/
COPY apps/mfe-agency/package.json      ./apps/mfe-agency/
COPY apps/mfe-client/package.json      ./apps/mfe-client/
COPY apps/mfe-organisation/package.json ./apps/mfe-organisation/
COPY packages/shared-ui/package.json      ./packages/shared-ui/
COPY packages/shared-services/package.json ./packages/shared-services/

RUN npm ci


# ─────────────────────────────────────────
# Stage 2 — Builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les manifestes du monorepo
COPY package.json package-lock.json turbo.json tsconfig.json ./

# Récupérer les dépendances installées
COPY --from=deps /app/node_modules ./node_modules

# Copier tout le code source nécessaire
COPY packages/ ./packages/
COPY apps/container-shell ./apps/container-shell

# ── Variables d'environnement connues au BUILD ──
# URLs des microfrontends (connues au déploiement)
ARG NEXT_PUBLIC_MFE_AGENCY_URL
ARG NEXT_PUBLIC_MFE_CLIENT_URL
ARG NEXT_PUBLIC_MFE_ORGANISATION_URL
# URL de l'API backend
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_MFE_AGENCY_URL=$NEXT_PUBLIC_MFE_AGENCY_URL
ENV NEXT_PUBLIC_MFE_CLIENT_URL=$NEXT_PUBLIC_MFE_CLIENT_URL
ENV NEXT_PUBLIC_MFE_ORGANISATION_URL=$NEXT_PUBLIC_MFE_ORGANISATION_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npx turbo run build --filter=@pwa-easy-rental/container-shell


# ─────────────────────────────────────────
# Stage 3 — Runner (image finale légère)
# ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copier le build standalone généré par Next.js
COPY --from=builder --chown=nextjs:nodejs /app/apps/container-shell/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/container-shell/.next/static     ./apps/container-shell/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/container-shell/public           ./apps/container-shell/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/container-shell/server.js"]
