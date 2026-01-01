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

    const productComments = await this.prisma.comment.findMany({
      where: { productId: comment.productId },
      select: { rating: true },
    });

    const newRate =
      productComments.map((c) => c.rating).reduce((a, b) => a + b, 0) /
      productComments.length;

    await this.prisma.product.update({
      where: { id: comment.productId },
      data: { rate: newRate },
    });

    return {
      id: review.id,
      name: review.user.firstName + ' ' + review.user.lastName,
      avatar: review.user.image,
      rate: review.rating,
      content: review.content,
    };
  }
}
