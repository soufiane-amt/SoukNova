import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentInfoDto } from '../dto/commentInfo.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(comment: commentInfoDto) {
    const review = await this.prisma.comment.create({
      data: {
        userId: comment.userId,
        productId: comment.productId,
        content: comment.content,
        rating: comment.rating,
      },
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

    return {
      id: review.id,
      name: review.user.firstName + ' ' + review.user.lastName,
      avatar: review.user.image,
      rate: review.rating,
      content: review.content,
    };
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
      orderBy: {
        addedAt: 'desc',
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      name: comment.user.firstName + ' ' + comment.user.lastName,
      avatar: comment.user.image,
      rate: comment.rating,
      content: comment.content,
    }));
  }
}
