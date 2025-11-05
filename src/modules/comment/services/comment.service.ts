import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentInfoDto } from '../dto/commentInfo.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(comment: commentInfoDto) {
    return this.prisma.comment.create({
      data: {
        userId: comment.userId,
        productId: comment.productId,
        content: comment.content,
        rating: comment.rating,
      },
    });
  }

  async getComments(productId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        rating: true,
        addedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });
    return comments.map((comment) => ({
      name: comment.user.firstName + ' ' + comment.user.lastName,
      avatar: comment.user.image,
      rate: comment.rating,
      content: comment.content,
    }));
  }
}
