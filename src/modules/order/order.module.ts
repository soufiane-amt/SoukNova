import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './services/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/services/auth.service';
import { UsersService } from '../users/services/users.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    JwtService,
    AuthService,
    UsersService,
  ],
})
export class OrderModule {}
