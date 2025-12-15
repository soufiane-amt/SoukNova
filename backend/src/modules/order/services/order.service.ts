import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from '../dto/order.dto';
import { getFormatInDate } from 'src/utils/helpers';
import { Order } from '@prisma/client';
import { RedisService } from 'src/modules/redis/service/redis.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  private getCacheKey(userId: number) {
    return `orders:${userId}`;
  }

  async createOrder(userId: number, orderData: OrderDto) {
    const order = await this.prisma.order.create({
      data: {
        userId,
        price: orderData.orderTotal,
      },
    });

    // Invalidate cache
    const redis = this.redisService.getClient();
    await redis.del(this.getCacheKey(userId));

    return order;
  }

  async getOrders(userId: number, page: number, pageSize: number) {
    const redis = this.redisService.getClient();

    const skip = (page - 1) * pageSize;

    const cacheKey = `orders:user=${userId}:page=${page}:size=${pageSize}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [totalCount, orders] = await Promise.all([
      this.prisma.order.count({
        where: { userId },
      }),
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: {
          addedAt: 'desc', 
        },
      }),
    ]);

    const formattedOrders = orders.map((order) => ({
      ...order,
      price: order.price.toFixed(2),
      date: getFormatInDate(order.addedAt),
    }));

    const result = {
      orders: formattedOrders,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 5);

    return result;
  }

  async getOrder(userId: number, orderId: string): Promise<Order> {
    // Optionally, we can try to get this order from cache too
    const redis = this.redisService.getClient();
    const cacheKey = `order:${userId}:${orderId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const order = await this.prisma.order.findUnique({
      where: { id: parseInt(orderId), userId },
    });

    if (!order) {
      throw new NotFoundException(
        `Order ${orderId} not found for user ${userId}`,
      );
    }

    const orderWithFormattedDate = {
      ...order,
      date: getFormatInDate(order.addedAt),
    };

    await redis.set(
      cacheKey,
      JSON.stringify(orderWithFormattedDate),
      'EX',
      60 * 5 * 480,
    );

    return orderWithFormattedDate;
  }
}
