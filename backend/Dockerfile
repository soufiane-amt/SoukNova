# Builder stage: install deps, generate Prisma client, build TS
FROM node:20-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl procps git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (cacheable layer)
COPY package*.json ./
RUN npm ci --silent || npm install --silent

# Generate Prisma client early so it can be cached
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the source and build
COPY . .
RUN npm run build

# Runtime stage: much smaller image with only production deps and built artifacts
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Minimal runtime dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install only production dependencies (uses package-lock.json if present)
COPY package*.json ./
RUN npm ci --omit=dev --silent || npm install --production --silent

# Copy built artifacts and Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
# Copy seed-data next to the compiled seed so require('./seed-data/...') in dist/prisma/seed.js resolves correctly
COPY --from=builder /app/prisma/seed-data ./dist/prisma/seed-data

EXPOSE 3001

# Run migrations, run compiled seed if available, then start
CMD ["sh", "-c", "npx prisma migrate deploy && if [ -f dist/prisma/seed.js ]; then node dist/prisma/seed.js; else echo 'No compiled seed found, skipping seed.'; fi && node dist/src/main.js"]
