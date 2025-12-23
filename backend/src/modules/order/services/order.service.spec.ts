import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  const now = new Date();

  const prismaMock = {
    order: {
      create: jest
        .fn()
        .mockResolvedValue({ id: 1, userId: 1, price: 10.5, addedAt: now }),
      count: jest.fn().mockResolvedValue(1),
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 1, userId: 1, price: 10.5, addedAt: now }]),
      findUnique: jest
        .fn()
        .mockResolvedValue({ id: 1, userId: 1, price: 10.5, addedAt: now }),
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
      providers: [OrderService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
        if (token === RedisService) return redisServiceMock;
      })
      .compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should create order and clear cache', async () => {
    prismaMock.order.create.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      price: 10.5,
      addedAt: now,
    });
    const result = await service.createOrder(5, { orderTotal: 123 } as any);

    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: { userId: 5, price: 123 },
    });
    expect(redisClient.del).toHaveBeenCalledWith(`orders:5`);
    expect(result).toEqual({ id: 1, userId: 1, price: 10.5, addedAt: now });
  });

  it('getOrders should return cached result when present', async () => {
    const cached = { orders: [], totalPages: 1 };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

    const res = await service.getOrders(1, 2, 10);
    expect(redisClient.get).toHaveBeenCalledWith(
      'orders:user=1:page=2:size=10',
    );
    expect(res).toEqual(cached);
  });

  it('getOrders should fetch from db and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.order.count.mockResolvedValueOnce(5);
    prismaMock.order.findMany.mockResolvedValueOnce([
      { id: 7, userId: 1, price: 3.5, addedAt: now },
    ]);

    const res = await service.getOrders(1, 1, 2);

    expect(prismaMock.order.count).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      skip: 0,
      take: 2,
      orderBy: { addedAt: 'desc' },
    });
    expect(res.orders[0].price).toBe('3.50');
    expect(res.totalPages).toBe(Math.ceil(5 / 2));
    expect(redisClient.set).toHaveBeenCalledWith(
      'orders:user=1:page=1:size=2',
      expect.any(String),
      'EX',
      60 * 5,
    );
  });

  it('getOrder should return cached when present', async () => {
    const cached = { id: 9, userId: 1, price: '10.00', date: 'Jan 1, 2020' };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

    const res = await service.getOrder(1, '9');
    expect(redisClient.get).toHaveBeenCalledWith('order:1:9');
    expect(res).toEqual(cached);
  });

  it('getOrder should throw NotFoundException when not found', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.order.findUnique.mockResolvedValueOnce(null);

    await expect(service.getOrder(1, '999')).rejects.toThrow(NotFoundException);
  });

  it('getOrder should fetch from db and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    const orderObj = { id: 3, userId: 2, price: 7.25, addedAt: now };
    prismaMock.order.findUnique.mockResolvedValueOnce(orderObj as any);

    const res = await service.getOrder(2, '3');

    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { id: 3, userId: 2 },
    });
    expect(res).toHaveProperty('date');
    expect(redisClient.set).toHaveBeenCalledWith(
      'order:2:3',
      expect.any(String),
      'EX',
      60 * 5 * 480,
    );
  });
});
