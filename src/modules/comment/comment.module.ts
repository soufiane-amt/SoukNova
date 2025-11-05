import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, JwtService],
})
export class CartModule {}
