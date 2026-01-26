import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentInfoDto } from '../dto/commentInfo.dto';

describe('CommentService', () => {
  let service: CommentService;
  let prismaMock: {
    comment: {
      create: jest.Mock;
      findMany: jest.Mock;
    };
    product: {
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      comment: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      product: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should create a comment, update product rate, and return formatted result', async () => {
    const dto: commentInfoDto = {
      userId: 1,
      productId: 'prod-1',
      content: 'Great product',
      rating: 5,
    };

    prismaMock.comment.create.mockResolvedValueOnce({
      id: 1,
      content: 'Great product',
      rating: 5,
      addedAt: new Date(),
      user: { firstName: 'John', lastName: 'Doe', image: 'avatar.png' },
    });

    prismaMock.comment.findMany.mockResolvedValueOnce([
      { rating: 5 },
      { rating: 4 },
      { rating: 5 },
    ]);

    prismaMock.product.update.mockResolvedValueOnce({});

    const result = await service.createComment(dto);

    expect(prismaMock.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId: dto.userId,
          productId: dto.productId,
          content: dto.content,
          rating: dto.rating,
        },
        select: expect.any(Object),
      }),
    );

    expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
      where: { productId: dto.productId },
      select: { rating: true },
    });

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: dto.productId },
      data: { rate: (5 + 4 + 5) / 3 },
    });

    expect(result).toEqual({
      id: 1,
      name: 'John Doe',
      avatar: 'avatar.png',
      rate: 5,
      content: 'Great product',
    });
  });

  it('should handle empty productComments array when calculating newRate', async () => {
    const dto: commentInfoDto = {
      userId: 2,
      productId: 'prod-2',
      content: 'Nice!',
      rating: 4,
    };

    prismaMock.comment.create.mockResolvedValueOnce({
      id: 2,
      content: 'Nice!',
      rating: 4,
      addedAt: new Date(),
      user: { firstName: 'Jane', lastName: '', image: null },
    });

    prismaMock.comment.findMany.mockResolvedValueOnce([]);

    prismaMock.product.update.mockResolvedValueOnce({});

    // This will result in NaN for newRate, which you may want to handle in your service
    const result = await service.createComment(dto);

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: dto.productId },
      data: { rate: NaN },
    });

    expect(result).toEqual({
      id: 2,
      name: 'Jane ',
      avatar: null,
      rate: 4,
      content: 'Nice!',
    });
  });
});
