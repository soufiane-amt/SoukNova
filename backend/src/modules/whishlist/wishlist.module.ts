import { Module } from '@nestjs/common';
import { WishlistController } from './controllers/wishlist.controller';
import { WishlistService } from './services/wishlist.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/services/auth.service';
import { UsersService } from '../users/services/users.service';

@Module({
  controllers: [WishlistController],
  providers: [
    WishlistService,
    PrismaService,
    JwtService,
    AuthService,
    UsersService,
  ],
})
export class WishlistModule {}
