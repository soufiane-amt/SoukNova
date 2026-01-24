import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- Standard NestJS setup ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const allowedPrefix = configService.get<string>('FRONTEND_URL_PREFIX');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedPrefix && origin.startsWith(allowedPrefix)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  });

  app.use(cookieParser());

  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });
  app.use(compression());

  // --- Bind to the port immediately ---
  const port = parseInt(process.env.PORT!, 10);
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS running on port ${port}`);

  // --- Connect to Prisma AFTER listening ---
  try {
    const prisma = app.get(PrismaService); // assumes you have a PrismaService provider
    await prisma.$connect();
    console.log('Prisma connected');
  } catch (err) {
    console.error('Prisma connection failed:', err);
  }

  // --- Optional: connect to Redis here as well ---
  // const redisClient = app.get(RedisService);
  // await redisClient.connect();
  // console.log('Redis connected');
}

void bootstrap();
