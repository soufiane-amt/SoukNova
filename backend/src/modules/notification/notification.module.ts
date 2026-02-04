import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationGateway } from './gateways/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, PrismaService],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
