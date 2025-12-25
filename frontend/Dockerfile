# Builder stage: install deps and build the Next.js app
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Use npm ci for reproducible installs; fall back to npm install if needed
RUN npm ci --legacy-peer-deps --silent || npm install --legacy-peer-deps --silent

# Copy source and build
COPY . .
RUN npm run build

# Runner stage: minimal runtime with only production dependencies and built output
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (uses lockfile if present)
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --silent || npm install --production --legacy-peer-deps --silent

# Copy built output and public assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]

