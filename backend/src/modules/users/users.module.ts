import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './controllers/users.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
