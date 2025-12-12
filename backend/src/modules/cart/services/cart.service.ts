import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemFullProps, CartItemProps } from '../dto/cart.dto';
import { RedisService } from 'src/modules/redis/service/redis.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async addToCart(
    userId: number,
    productId: string,
  ): Promise<CartItemFullProps> {
    const cacheKey = `cart:${userId}`;
    const updatedItem = await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: 1 } },
      create: { userId, productId, quantity: 1 },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            primary_image: true,
            discount: true,
            price: true,
          },
        },
      },
    });

    const cartItem: CartItemFullProps = {
      productId: updatedItem.product.id,
      productName: updatedItem.product.title,
      image: updatedItem.product.primary_image,
      price: updatedItem.product.price,
      quantity: updatedItem.quantity,
      discount: parseInt(updatedItem.product.discount ?? '0'),
    };
    await this.redisService.getClient().del(cacheKey);
    return cartItem;
  }

  async decreaseFromCart(userId: number, productId: string) {
    const cacheKey = `cart:${userId}`;
    try {
      const updated = await this.prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: { decrement: 1 } },
        select: { quantity: true },
      });
      if (updated.quantity <= 0) {
        await this.prisma.cartItem.delete({
          where: { userId_productId: { userId, productId } },
        });
        return { quantity: 0 };
      }
      await this.redisService.getClient().del(cacheKey);
      return updated;
    } catch {
      throw new NotFoundException('Cart item not found');
    }
  }

  async removeFromCart(userId: number, productId: string) {
    const cacheKey = `cart:${userId}`;
    const updated = await this.prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    await this.redisService.getClient().del(cacheKey);
    return updated;
  }

  async updateQuantity(userId: number, productId: string, quantity: number) {
    const cacheKey = `cart:${userId}`;
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const updated = await this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
    await this.redisService.getClient().del(cacheKey);
    return updated;
  }

  async getCart(userId: number): Promise<CartItemFullProps[]> {
    const cacheKey = `cart:${userId}`;

    const redis = this.redisService.getClient();

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const cartProducts = await this.prisma.cartItem.findMany({
      where: { userId },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            primary_image: true,
            discount: true,
            price: true,
          },
        },
      },
    });

    const cartList: CartItemFullProps[] = cartProducts.map((item) => ({
      productId: item.product.id,
      productName: item.product.title,
      image: item.product.primary_image,
      price: item.product.price,
      quantity: item.quantity,
      discount: parseInt(item.product.discount ?? '0'),
    }));
    await redis.set(cacheKey, JSON.stringify(cartList), 'EX', 60 * 5);
    return cartList;
  }

  async getCartItemQuantity(userId: number, productId: string) {
    const quantity = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { quantity: true },
    });
    return quantity || { quantity: 0 };
  }

  async deleteCarts(userId: number) {
    const cacheKey = `cart:${userId}`;

    const updated = await this.prisma.cartItem.deleteMany({
      where: {
        userId: userId,
      },
    });
    await this.redisService.getClient().del(cacheKey);
    return updated;
  }
}
