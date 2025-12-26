import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  let allowedPrefix = configService.get<string>('FRONTEND_URL_PREFIX');

  app.enableCors({
    origin: (origin, callback) => {
      // allow server-to-server or tools like Postman
      if (!origin) return callback(null, true);

      if (allowedPrefix && origin.startsWith(allowedPrefix)) {
        return callback(null, true);
      }

      // explicitly deny
      return callback(null, false); // ✅ must be null, not new Error
    },
    credentials: true,
  });
  app.use(cookieParser());

  const uploadsPath = join(process.cwd(), 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  app.use(compression());

  await app.listen(3001, '0.0.0.0');
}
void bootstrap();
