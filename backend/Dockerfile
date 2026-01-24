# Builder stage
FROM node:20-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl procps git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent || npm install --silent

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --silent || npm install --production --silent

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/prisma/seed-data ./dist/prisma/seed-data

EXPOSE 3001

# ✅ START SERVER IMMEDIATELY
CMD ["sh", "-c", "\
  echo 'Running Prisma migrations...'; \
  npx prisma migrate deploy --preview-feature || echo 'Migrations failed'; \
  if [ -f dist/prisma/seed.js ]; then \
    echo 'Running seed script...'; \
    node dist/prisma/seed.js || echo 'Seed failed'; \
  else \
    echo 'No seed file found, skipping'; \
  fi; \
  echo 'Starting NestJS...'; \
  node dist/src/main.js \
"]
