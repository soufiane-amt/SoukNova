import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemFullProps, CartItemProps } from '../dto/cart.dto';

const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';

@Injectable()
export class CartService {
  private cache = new Map<string, CartItemProps>();

  constructor(private readonly prisma: PrismaService) {}

  async addToCart(
    userId: number,
    productId: string,
  ): Promise<CartItemFullProps | undefined> {
    const cartItem = await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: 1 } },
      create: { userId, productId, quantity: 1 },
    });

    // Fetch product details
    const res = await fetch(
      `https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1/products?id=eq.${productId}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );

    const [productData] = await res.json();
    if (!productData) return undefined;

    const fullCartItem: CartItemFullProps = {
      productId: productData.id,
      productName: productData.title,
      image: productData.primary_image,
      price: productData.Price,
      quantity: cartItem.quantity,
      discount: parseInt(productData.discount),
    };

    return fullCartItem;
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
      await this.prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
      return { quantity: 0 };
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
    const products = await this.prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true, quantity: true },
    });

    const cartList: CartItemFullProps[] = [];

    for (const item of products) {
      if (this.cache.has(item.productId)) {
        const cached = this.cache.get(item.productId);
        if (cached) {
          cartList.push({
            ...cached,
            quantity: item.quantity,
            productId: item.productId,
          });
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
      const [data] = await res.json();

      const product: CartItemFullProps = {
        productId: item.productId,
        productName: data.title,
        image: data.primary_image,
        price: data.Price,
        quantity: item.quantity,
        discount: parseInt(data.discount),
      };

      this.cache.set(item.productId, product);

      cartList.push(product);
    }

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
    return this.prisma.cartItem.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
