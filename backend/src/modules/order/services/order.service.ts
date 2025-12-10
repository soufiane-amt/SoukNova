import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from '../dto/order.dto';
import { getFormatInDate } from 'src/utils/helpers';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, orderData: OrderDto) {
    return this.prisma.order.create({
      data: {
        userId: userId,
        price: orderData.orderTotal,
      },
    });
  }

  async getOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
    });
    return orders.map((order) => {
      return {
        ...order,
        price: order.price.toFixed(2),
        date: getFormatInDate(order.addedAt),
      };
    });
  }

  async getOrder(userId: number, orderId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: parseInt(orderId), user: { id: userId } },
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

    return orderWithFormattedDate;
  }
}
