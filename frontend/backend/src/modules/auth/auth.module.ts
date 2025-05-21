import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthService, UsersService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
