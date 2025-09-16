import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: number, productId: string) {
    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: 1 } },
      create: { userId, productId, quantity: 1 },
    });
  }

  async removeFromCart(userId: number, productId: string) {
    return this.prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async updateQuantity(userId: number, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    return this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
  }

  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true, quantity: true },
    });

    const products = await Promise.all(
      items.map(async (item) => {
        const res = await fetch(
          `https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1/products?select=id,title,price&id=eq.${item.productId}`,
        );
        const [product] = await res.json();
        return { ...product, quantity: item.quantity };
      }),
    );

    return products;
  }

  async getCartItemQuantity(userId: number, productId: string) {
    return this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { quantity: true },
    });
  }
}
