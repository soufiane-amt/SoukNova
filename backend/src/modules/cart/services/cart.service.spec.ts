import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prismaMock: any;
  let redisClient: any;
  let redisServiceMock: any;

  beforeEach(async () => {
    const now = new Date();

    prismaMock = {
      cartItem: {
        upsert: jest.fn().mockResolvedValue({
          quantity: 2,
          product: {
            id: 'prod-1',
            title: 'Product 1',
            primary_image: 'img.png',
            discount: '10',
            price: 9.99,
          },
        }),
        update: jest.fn().mockResolvedValue({ quantity: 1 }),
        delete: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([
          {
            quantity: 3,
            product: {
              id: 'p1',
              title: 'P1',
              primary_image: 'i.png',
              discount: '0',
              price: 5.5,
            },
          },
        ]),
        findUnique: jest.fn().mockResolvedValue({ quantity: 4 }),
        deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
    };

    redisClient = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    };

    redisServiceMock = {
      getClient: () => redisClient,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
        if (token === RedisService) return redisServiceMock;
      })
      .compile();

    service = module.get<CartService>(CartService);
  });

  it('addToCart should upsert and return formatted item and clear cache', async () => {
    const result = await service.addToCart(1, 'prod-1');

    expect(prismaMock.cartItem.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_productId: { userId: 1, productId: 'prod-1' } },
      }),
    );

    expect(redisClient.del).toHaveBeenCalledWith('cart:1');

    expect(result).toEqual({
      productId: 'prod-1',
      productName: 'Product 1',
      image: 'img.png',
      price: 9.99,
      quantity: 2,
      discount: 10,
    });
  });

  it('decreaseFromCart should decrement quantity and clear cache', async () => {
    prismaMock.cartItem.update.mockResolvedValueOnce({ quantity: 2 });

    const result = await service.decreaseFromCart(1, 'prod-1');

    expect(prismaMock.cartItem.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_productId: { userId: 1, productId: 'prod-1' } },
      }),
    );
    expect(redisClient.del).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual({ quantity: 2 });
  });

  it('decreaseFromCart should delete item and return quantity 0 when quantity goes <= 0', async () => {
    prismaMock.cartItem.update.mockResolvedValueOnce({ quantity: 0 });
    prismaMock.cartItem.delete.mockResolvedValueOnce({});

    const result = await service.decreaseFromCart(1, 'prod-1');

    expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 1, productId: 'prod-1' } },
    });
    expect(result).toEqual({ quantity: 0 });
  });

  it('decreaseFromCart should throw NotFoundException when update fails', async () => {
    prismaMock.cartItem.update.mockRejectedValueOnce(new Error('not found'));

    await expect(service.decreaseFromCart(1, 'missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('removeFromCart should delete and clear cache', async () => {
    prismaMock.cartItem.delete.mockResolvedValueOnce({});

    const result = await service.removeFromCart(1, 'prod-1');

    expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 1, productId: 'prod-1' } },
    });
    expect(redisClient.del).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual({});
  });

  it('updateQuantity should remove when quantity <= 0', async () => {
    // remove path
    prismaMock.cartItem.delete.mockResolvedValueOnce({});

    const result = await service.updateQuantity(1, 'prod-1', 0);

    expect(prismaMock.cartItem.delete).toHaveBeenCalled();
    expect(redisClient.del).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual({});
  });

  it('updateQuantity should update and clear cache when quantity > 0', async () => {
    prismaMock.cartItem.update.mockResolvedValueOnce({ quantity: 5 });

    const result = await service.updateQuantity(1, 'prod-1', 5);

    expect(prismaMock.cartItem.update).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 1, productId: 'prod-1' } },
      data: { quantity: 5 },
    });
    expect(redisClient.del).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual({ quantity: 5 });
  });

  it('getCart should return cached value when present', async () => {
    const cached = [{ productId: 'x', quantity: 1 }];
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

    const result = await service.getCart(1);

    expect(redisClient.get).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual(cached);
    expect(prismaMock.cartItem.findMany).not.toHaveBeenCalled();
  });

  it('getCart should fetch, format and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.cartItem.findMany.mockResolvedValueOnce([
      {
        quantity: 3,
        product: {
          id: 'p1',
          title: 'P1',
          primary_image: 'i.png',
          discount: '5',
          price: 2.5,
        },
      },
    ]);

    const result = await service.getCart(1);

    expect(prismaMock.cartItem.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      select: expect.any(Object),
    });
    expect(redisClient.set).toHaveBeenCalledWith(
      'cart:1',
      expect.any(String),
      'EX',
      60 * 5,
    );

    expect(result[0]).toEqual({
      productId: 'p1',
      productName: 'P1',
      image: 'i.png',
      price: 2.5,
      quantity: 3,
      discount: 5,
    });
  });

  it('getCartItemQuantity should return quantity or zero', async () => {
    prismaMock.cartItem.findUnique.mockResolvedValueOnce({ quantity: 7 });
    let result = await service.getCartItemQuantity(1, 'p1');
    expect(result).toEqual({ quantity: 7 });

    prismaMock.cartItem.findUnique.mockResolvedValueOnce(null);
    result = await service.getCartItemQuantity(1, 'p2');
    expect(result).toEqual({ quantity: 0 });
  });

  it('deleteCarts should deleteMany and clear cache', async () => {
    prismaMock.cartItem.deleteMany.mockResolvedValueOnce({ count: 2 });

    const result = await service.deleteCarts(1);

    expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(redisClient.del).toHaveBeenCalledWith('cart:1');
    expect(result).toEqual({ count: 2 });
  });
});
