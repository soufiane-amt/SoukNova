import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './services/comment.service';
import { AuthService } from '../auth/services/auth.service';
import { UsersService } from '../users/services/users.service';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    PrismaService,
    JwtService,
    AuthService,
    UsersService,
  ],
})
export class CommentModule {}
