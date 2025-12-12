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

  async getOrders(userId: number) {
    const redis = this.redisService.getClient();
    const cacheKey = this.getCacheKey(userId);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const orders = await this.prisma.order.findMany({
      where: { userId },
    });

    const formattedOrders = orders.map((order) => ({
      ...order,
      price: order.price.toFixed(2),
      date: getFormatInDate(order.addedAt),
    }));

    await redis.set(cacheKey, JSON.stringify(formattedOrders), 'EX', 60 * 5);

    return formattedOrders;
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
