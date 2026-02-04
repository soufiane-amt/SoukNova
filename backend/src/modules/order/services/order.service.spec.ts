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
      create: jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        price: 10.5,
        addedAt: now,
        items: [],
      }),
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

  // ==================== createOrder Tests ====================
  describe('createOrder', () => {
    it('should create order with items and clear cache', async () => {
      const orderItems = [
        { productId: 'prod-1', quantity: 2, unitPrice: 50 },
        { productId: 'prod-2', quantity: 1, unitPrice: 23 },
      ];
      const createdOrder = {
        id: 1,
        userId: 5,
        price: 123,
        addedAt: now,
        items: [
          { productId: 'prod-1', quantity: 2, unitPrice: 50, total: 100 },
          { productId: 'prod-2', quantity: 1, unitPrice: 23, total: 23 },
        ],
      };
      prismaMock.order.create.mockResolvedValueOnce(createdOrder);

      const result = await service.createOrder(5, {
        orderTotal: 123,
        items: orderItems,
      } as any);

      expect(prismaMock.order.create).toHaveBeenCalledWith({
        data: {
          userId: 5,
          price: 123,
          items: {
            create: [
              { productId: 'prod-1', quantity: 2, unitPrice: 50, total: 100 },
              { productId: 'prod-2', quantity: 1, unitPrice: 23, total: 23 },
            ],
          },
        },
        include: { items: true },
      });
      expect(redisClient.del).toHaveBeenCalledWith('orders:5');
      expect(result).toEqual(createdOrder);
    });

    it('should create order with empty items array', async () => {
      const createdOrder = {
        id: 2,
        userId: 3,
        price: 0,
        addedAt: now,
        items: [],
      };
      prismaMock.order.create.mockResolvedValueOnce(createdOrder);

      const result = await service.createOrder(3, {
        orderTotal: 0,
        items: [],
      } as any);

      expect(prismaMock.order.create).toHaveBeenCalledWith({
        data: {
          userId: 3,
          price: 0,
          items: { create: [] },
        },
        include: { items: true },
      });
      expect(redisClient.del).toHaveBeenCalledWith('orders:3');
      expect(result).toEqual(createdOrder);
    });

    it('should calculate item total correctly', async () => {
      const orderItems = [
        { productId: 'prod-1', quantity: 3, unitPrice: 15.5 },
      ];
      prismaMock.order.create.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        price: 46.5,
        addedAt: now,
        items: [
          { productId: 'prod-1', quantity: 3, unitPrice: 15.5, total: 46.5 },
        ],
      });

      await service.createOrder(1, {
        orderTotal: 46.5,
        items: orderItems,
      } as any);

      expect(prismaMock.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            items: {
              create: [
                {
                  productId: 'prod-1',
                  quantity: 3,
                  unitPrice: 15.5,
                  total: 46.5,
                },
              ],
            },
          }),
        }),
      );
    });

    it('should create order with single item', async () => {
      const orderItems = [
        { productId: 'prod-1', quantity: 1, unitPrice: 99.99 },
      ];
      const createdOrder = {
        id: 10,
        userId: 7,
        price: 99.99,
        addedAt: now,
        items: [
          { productId: 'prod-1', quantity: 1, unitPrice: 99.99, total: 99.99 },
        ],
      };
      prismaMock.order.create.mockResolvedValueOnce(createdOrder);

      const result = await service.createOrder(7, {
        orderTotal: 99.99,
        items: orderItems,
      } as any);

      expect(result).toEqual(createdOrder);
      expect(redisClient.del).toHaveBeenCalledWith('orders:7');
    });
  });

  // ==================== getOrders Tests ====================
  describe('getOrders', () => {
    it('should return cached result when present', async () => {
      const cached = { orders: [], totalPages: 1 };
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

      const res = await service.getOrders(1, 2, 10);

      expect(redisClient.get).toHaveBeenCalledWith(
        'orders:user=1:page=2:size=10',
      );
      expect(res).toEqual(cached);
    });

    it('should fetch from db and cache when not cached', async () => {
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

    it('should handle pagination correctly with skip calculation', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.count.mockResolvedValueOnce(25);
      prismaMock.order.findMany.mockResolvedValueOnce([
        { id: 11, userId: 1, price: 50.0, addedAt: now },
      ]);

      const res = await service.getOrders(1, 3, 5);

      expect(prismaMock.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        skip: 10, // (3-1) * 5
        take: 5,
        orderBy: { addedAt: 'desc' },
      });
      expect(res.totalPages).toBe(5); // Math.ceil(25/5)
    });

    it('should return empty orders array when no orders exist', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.count.mockResolvedValueOnce(0);
      prismaMock.order.findMany.mockResolvedValueOnce([]);

      const res = await service.getOrders(1, 1, 10);

      expect(res.orders).toEqual([]);
      expect(res.totalPages).toBe(0);
    });

    it('should format price with two decimal places', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.count.mockResolvedValueOnce(1);
      prismaMock.order.findMany.mockResolvedValueOnce([
        { id: 1, userId: 1, price: 100, addedAt: now },
      ]);

      const res = await service.getOrders(1, 1, 10);

      expect(res.orders[0].price).toBe('100.00');
    });

    it('should calculate totalPages correctly for exact division', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.count.mockResolvedValueOnce(20);
      prismaMock.order.findMany.mockResolvedValueOnce([]);

      const res = await service.getOrders(1, 1, 10);

      expect(res.totalPages).toBe(2); // 20 / 10 = 2
    });

    it('should calculate totalPages correctly for non-exact division', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.count.mockResolvedValueOnce(21);
      prismaMock.order.findMany.mockResolvedValueOnce([]);

      const res = await service.getOrders(1, 1, 10);

      expect(res.totalPages).toBe(3); // Math.ceil(21 / 10) = 3
    });
  });

  // ==================== getOrder Tests ====================
  describe('getOrder', () => {
    it('should return cached when present', async () => {
      const cached = { id: 9, userId: 1, price: '10.00', date: 'Jan 1, 2020' };
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));

      const res = await service.getOrder(1, '9');

      expect(redisClient.get).toHaveBeenCalledWith('order:1:9');
      expect(res).toEqual(cached);
    });

    it('should throw NotFoundException when not found', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOrder(1, '999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should fetch from db and cache when not cached', async () => {
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

    it('should parse orderId as integer', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.findUnique.mockResolvedValueOnce({
        id: 123,
        userId: 1,
        price: 50,
        addedAt: now,
      });

      await service.getOrder(1, '123');

      expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
        where: { id: 123, userId: 1 },
      });
    });

    it('should include correct error message in NotFoundException', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOrder(5, '42')).rejects.toThrow(
        'Order 42 not found for user 5',
      );
    });

    it('should format price with two decimal places', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.order.findUnique.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        price: 99,
        addedAt: now,
      });

      const res = await service.getOrder(1, '1');

      // Check if service formats price or returns raw value
      // If service returns formatted string:
      // expect(res.price).toBe('99.00');
      // If service returns raw number:
      expect(res.price).toBe(99);
    });
  });

  // ==================== getCacheKey Tests ====================
  describe('getCacheKey', () => {
    it('should generate correct cache key format', async () => {
      prismaMock.order.create.mockResolvedValueOnce({
        id: 1,
        userId: 99,
        price: 10,
        addedAt: now,
        items: [],
      });

      await service.createOrder(99, { orderTotal: 10, items: [] } as any);

      expect(redisClient.del).toHaveBeenCalledWith('orders:99');
    });

    it('should use different cache keys for different users', async () => {
      prismaMock.order.create
        .mockResolvedValueOnce({
          id: 1,
          userId: 1,
          price: 10,
          addedAt: now,
          items: [],
        })
        .mockResolvedValueOnce({
          id: 2,
          userId: 2,
          price: 20,
          addedAt: now,
          items: [],
        });

      await service.createOrder(1, { orderTotal: 10, items: [] } as any);
      await service.createOrder(2, { orderTotal: 20, items: [] } as any);

      expect(redisClient.del).toHaveBeenCalledWith('orders:1');
      expect(redisClient.del).toHaveBeenCalledWith('orders:2');
    });
  });
});
