import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
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

  // CORS for HTTP requests
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  
  app.use(cookieParser());

  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  app.use(compression());

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
