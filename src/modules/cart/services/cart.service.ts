import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemFullProps, CartItemProps } from '../dto/cart.dto';

const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';

@Injectable()
export class CartService {
  private cache = new Map<string, CartItemProps>();

  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: number, productId: string) {
    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: 1 } },
      create: { userId, productId, quantity: 1 },
    });
  }

  async decreaseFromCart(userId: number, productId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { quantity: true },
    });

    if (!item) {
      throw new Error('Cart item not found');
    }

    if (item.quantity > 1) {
      return this.prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: {
          quantity: { decrement: 1 },
        },
      });
    } else {
      return this.prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
    }
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

  async getCart(userId: number): Promise<CartItemProps[]> {
    const productsIds = await this.prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true, quantity: true },
    });

    const cartList: CartItemProps[] = [];

    for (const item of productsIds) {
      if (this.cache.has(item.productId)) {
        console.log('Serving from cache');
        const cached = this.cache.get(item.productId);
        if (cached) {
          cartList.push(cached);
          continue;
        }
        continue;
      }
      const res = await fetch(
        `https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1/products?id=eq.${item.productId}`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        },
      );
      console.log('===> res : ', res);
      const [data] = await res.json();

      const product: CartItemFullProps = {
        productId: data.id,
        productName: data.title,
        image: data.primary_image,
        price: data.Price,
        quantity: item.quantity,
      };

      this.cache.set(item.productId, product);

      cartList.push(product);
    }

    console.log('cartList : ', cartList);
    return cartList;
  }
  async getCartItemQuantity(userId: number, productId: string) {
    const quantity = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { quantity: true },
    });
    console.log('quantity : ', quantity);
    return quantity || { quantity: 0 };
  }
}
