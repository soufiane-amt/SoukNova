import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';

describe('WishlistService', () => {
  let service: WishlistService;
  let prismaMock: any;
  let redisMock: any;
  let redisClientMock: any;

  beforeEach(async () => {
    redisClientMock = {
      get: jest.fn(),
      set: jest.fn(),
      unlink: jest.fn(),
      scanStream: jest.fn().mockReturnValue({
        [Symbol.asyncIterator]: async function* () {
          yield [];
        },
      }),
    };
    redisMock = {
      getClient: jest.fn(() => redisClientMock),
    };
    prismaMock = {
      wishlist: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add to wishlist if not existing and clear cache', async () => {
    prismaMock.wishlist.findUnique.mockResolvedValue(null);
    prismaMock.wishlist.create.mockResolvedValue({
      userId: 1,
      productId: 'p1',
    });
    const clearSpy = jest
      .spyOn(service, 'clearWishlistCache')
      .mockResolvedValue();

    const result = await service.addToWishlist(1, 'p1');
    expect(prismaMock.wishlist.findUnique).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 1, productId: 'p1' } },
    });
    expect(prismaMock.wishlist.create).toHaveBeenCalledWith({
      data: { userId: 1, productId: 'p1' },
    });
    expect(clearSpy).toHaveBeenCalledWith(1);
    expect(result).toEqual({ userId: 1, productId: 'p1' });
  });

  it('should return existing wishlist item if already exists', async () => {
    prismaMock.wishlist.findUnique.mockResolvedValue({
      userId: 1,
      productId: 'p1',
    });
    const clearSpy = jest
      .spyOn(service, 'clearWishlistCache')
      .mockResolvedValue();

    const result = await service.addToWishlist(1, 'p1');
    expect(prismaMock.wishlist.findUnique).toHaveBeenCalled();
    expect(prismaMock.wishlist.create).not.toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ userId: 1, productId: 'p1' });
  });

  it('should remove from wishlist and clear cache', async () => {
    prismaMock.wishlist.delete.mockResolvedValue({
      userId: 1,
      productId: 'p1',
    });
    const clearSpy = jest
      .spyOn(service, 'clearWishlistCache')
      .mockResolvedValue();

    const result = await service.removeFromWishlist(1, 'p1');
    expect(clearSpy).toHaveBeenCalledWith(1);
    expect(prismaMock.wishlist.delete).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 1, productId: 'p1' } },
    });
    expect(result).toEqual({ userId: 1, productId: 'p1' });
  });

  it('should get wishlist from cache if available', async () => {
    redisClientMock.get.mockResolvedValue(
      JSON.stringify({ items: [], totalPages: 1 }),
    );

    const result = await service.getWishlist(1, 1, 10);
    expect(redisClientMock.get).toHaveBeenCalledWith(
      'wishlist:user:1:page:1:size:10',
    );
    expect(result).toEqual({ items: [], totalPages: 1 });
  });

  it('should get wishlist from db and cache it if not in cache', async () => {
    redisClientMock.get.mockResolvedValue(null);
    prismaMock.wishlist.count.mockResolvedValue(2);
    prismaMock.wishlist.findMany.mockResolvedValue([
      {
        product: {
          id: 'p1',
          title: 'Product 1',
          primary_image: 'img1',
          price: 100,
        },
      },
      {
        product: {
          id: 'p2',
          title: 'Product 2',
          primary_image: 'img2',
          price: 200,
        },
      },
    ]);
    redisClientMock.set.mockResolvedValue('OK');

    const result = await service.getWishlist(1, 1, 2);
    expect(prismaMock.wishlist.count).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(prismaMock.wishlist.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      skip: 0,
      take: 2,
      orderBy: { addedAt: 'desc' },
      select: {
        product: {
          select: {
            id: true,
            title: true,
            primary_image: true,
            price: true,
          },
        },
      },
    });
    expect(redisClientMock.set).toHaveBeenCalled();
    expect(result).toEqual({
      items: [
        {
          productId: 'p1',
          productName: 'Product 1',
          image: 'img1',
          price: 100,
        },
        {
          productId: 'p2',
          productName: 'Product 2',
          image: 'img2',
          price: 200,
        },
      ],
      totalPages: 1,
    });
  });

  it('should clear wishlist cache', async () => {
    // Simulate scanStream yielding keys
    redisClientMock.scanStream.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield [
          'wishlist:user:1:page:1:size:10',
          'wishlist:user:1:page:2:size:10',
        ];
      },
    });
    redisClientMock.unlink.mockResolvedValue(2);

    await service.clearWishlistCache(1);
    expect(redisClientMock.unlink).toHaveBeenCalledWith(
      'wishlist:user:1:page:1:size:10',
      'wishlist:user:1:page:2:size:10',
    );
  });
});
