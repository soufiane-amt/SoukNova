import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentInfoDto } from '../dto/commentInfo.dto';

describe('CommentService', () => {
  let service: CommentService;
  const prismaMock = {
    comment: {
      create: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
      })
      .compile();

    service = module.get<CommentService>(CommentService);
  });

  it('createComment should call prisma.create and return formatted result', async () => {
    const dto: commentInfoDto = {
      userId: 1,
      productId: 'p1',
      content: 'Nice product',
      rating: 5,
    };

    prismaMock.comment.create.mockResolvedValueOnce({
      id: 1,
      content: 'Nice product',
      rating: 5,
      addedAt: new Date(),
      user: { firstName: 'John', lastName: 'Doe', image: 'avatar.png' },
    });
    const res = await service.createComment(dto);

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

    expect(res).toEqual({
      id: 1,
      name: 'John Doe',
      avatar: 'avatar.png',
      rate: 5,
      content: 'Nice product',
    });
  });

  it('should create a comment and return formatted result', async () => {
    const dto: commentInfoDto = {
      userId: 1,
      productId: 'prod-1',
      content: 'Great product',
      rating: 5,
    };

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

    expect(result).toEqual({
      id: 1,
      name: 'John Doe',
      avatar: 'avatar.png',
      rate: 5,
      content: 'Great product',
    });
  });

  it('should handle different user name and avatar values', async () => {
    (prismaMock.comment.create as jest.Mock).mockResolvedValueOnce({
      id: 2,
      content: 'Nice',
      rating: 4,
      addedAt: new Date(),
      user: { firstName: 'Jane', lastName: '', image: null },
    });

    const dto: commentInfoDto = {
      userId: 2,
      productId: 'p2',
      content: 'Nice',
      rating: 4,
    };

    const result = await service.createComment(dto);

    expect(result).toMatchObject({
      id: 2,
      name: 'Jane ',
      avatar: null,
      rate: 4,
      content: 'Nice',
    });
  });
});
