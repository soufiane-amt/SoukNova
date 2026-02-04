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
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  // CORS for HTTP requests
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  
  app.use(cookieParser());

  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  app.use(compression());

  // IMPORTANT: Set up Socket.IO adapter BEFORE listen
  app.useWebSocketAdapter(new IoAdapter(app));
  
  const port = 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 HTTP Server running on: http://localhost:${port}`);
  console.log(`🔌 WebSocket Server running on: ws://localhost:${port}/socket.io/`);
  console.log(`🌐 Accepting connections from: ${frontendUrl}`);
}

void bootstrap();
