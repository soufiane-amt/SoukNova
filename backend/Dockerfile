# backend/Dockerfile
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# After copying package.json and installing dependencies
COPY prisma ./prisma
RUN npx prisma generate

# Copy source files
COPY . .

# Build the app
RUN npm run build 



# Expose app port
EXPOSE 3001

# Start compiled app
CMD npx prisma migrate deploy && npm run start

