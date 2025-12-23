import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';

describe('WishlistService', () => {
  let service: WishlistService;

  const now = new Date();

  const prismaMock = {
    wishlist: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(1),
      findMany: jest.fn().mockResolvedValue([
        {
          product: {
            id: 'p1',
            title: 'P1',
            primary_image: 'i.png',
            price: 12.5,
          },
        },
      ]),
    },
  } as any;

  const redisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  };
  const redisServiceMock = { getClient: () => redisClient };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
        if (token === RedisService) return redisServiceMock;
      })
      .compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('addToWishlist should return existing if found', async () => {
    const existing = { id: 1, userId: 1, productId: 'p1' };
    prismaMock.wishlist.findUnique.mockResolvedValueOnce(existing);

    const res = await service.addToWishlist(1, 'p1');
    expect(prismaMock.wishlist.findUnique).toHaveBeenCalledWith({ where: { userId_productId: { userId: 1, productId: 'p1' } } });
    expect(res).toBe(existing);
  });

  it('addToWishlist should create and clear cache when not existing', async () => {
    prismaMock.wishlist.findUnique.mockResolvedValueOnce(null);
    const created = { id: 2, userId: 1, productId: 'p2' };
    prismaMock.wishlist.create.mockResolvedValueOnce(created);

    const res = await service.addToWishlist(1, 'p2');

    expect(prismaMock.wishlist.create).toHaveBeenCalledWith({ data: { userId: 1, productId: 'p2' } });
    expect(redisClient.del).toHaveBeenCalledWith('wishlist:1');
    expect(res).toBe(created);
  });

  it('removeFromWishlist should delete and clear cache', async () => {
    prismaMock.wishlist.delete.mockResolvedValueOnce({ id: 3 });

    const res = await service.removeFromWishlist(1, 'p3');

    expect(prismaMock.wishlist.delete).toHaveBeenCalledWith({ where: { userId_productId: { userId: 1, productId: 'p3' } } });
    expect(redisClient.del).toHaveBeenCalledWith('wishlist:1');
    expect(res).toEqual({ id: 3 });
  });

  it('getWishlist should return cached when present', async () => {
    const cached = { items: [], totalPages: 1 };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

    const res = await service.getWishlist(1, 2, 10);
    expect(redisClient.get).toHaveBeenCalledWith('wishlist:user:1:page:2:size:10');
    expect(res).toEqual(cached);
  });

  it('getWishlist should fetch from db and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.wishlist.count.mockResolvedValueOnce(5);
    prismaMock.wishlist.findMany.mockResolvedValueOnce([
      { product: { id: 'p9', title: 'P9', primary_image: 'img.png', price: 7.5 } },
    ]);

    const res = await service.getWishlist(1, 1, 2);

    expect(prismaMock.wishlist.count).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(prismaMock.wishlist.findMany).toHaveBeenCalledWith({ where: { userId: 1 }, skip: 0, take: 2, orderBy: { addedAt: 'desc' }, select: { product: { select: { id: true, title: true, primary_image: true, price: true } } } });

    expect(res.items[0]).toEqual({ productId: 'p9', productName: 'P9', image: 'img.png', price: 7.5 });
    expect(res.totalPages).toBe(Math.ceil(5 / 2));
    expect(redisClient.set).toHaveBeenCalledWith('wishlist:user:1:page:1:size:2', expect.any(String), 'EX', 60 * 5);
  });
});
