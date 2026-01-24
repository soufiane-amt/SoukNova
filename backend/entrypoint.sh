#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy || echo "Migrations failed"

if [ -f dist/prisma/seed.js ]; then
  echo "Running seed script..."
  node dist/prisma/seed.js || echo "Seed failed"
else
  echo "No seed file found, skipping"
fi

echo "Starting NestJS..."
# exec node dist/src/main.js
