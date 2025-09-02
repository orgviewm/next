# ---- build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Faster installs
ENV CI=true
COPY package*.json ./
RUN npm ci --omit=optional || npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- run stage ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Only what's needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["npm", "start"]