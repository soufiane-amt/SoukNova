import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/services/auth.service';
import { UsersService } from '../users/services/users.service';
import { CartController } from './controllers/cart.contoller';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    PrismaService,
    JwtService,
    AuthService,
    UsersService,
  ],
})
export class CartModule {}
