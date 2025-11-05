import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComments(productId: string) {
    return this.prisma.comment.findMany({
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
          },
        },
      },
    });
  }
}
