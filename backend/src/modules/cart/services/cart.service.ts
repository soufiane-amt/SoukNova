import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemFullProps, CartItemProps } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(
    userId: number,
    productId: string,
  ): Promise<CartItemFullProps> {
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
    return cartItem;
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

  async getCart(userId: number): Promise<CartItemFullProps[]> {
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
