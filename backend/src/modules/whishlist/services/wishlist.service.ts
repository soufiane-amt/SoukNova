import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WishItemType } from '../dto/wish-item.dto';

@Injectable()
export class WishlistService {
  private cache = new Map<string, WishItemType>();

  constructor(private readonly prisma: PrismaService) {}

  async addToWishlist(userId: number, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.wishlist.create({
      data: { userId, productId },
    });
  }

  async removeFromWishlist(userId: number, productId: string) {
    this.cache.delete(productId);
    return this.prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async getWishlist(userId: number) :Promise<WishItemType[]>{
    const wishListProducts = await this.prisma.wishlist.findMany({
      where: { userId },
      select: {
        product: {
          select: {
            id: true,
            title: true,
            primary_image: true,
            price: true,
          },
        },
      },
    });

    return wishListProducts.map((item) => ({
      productId: item.product.id,
      productName: item.product.title,
      image: item.product.primary_image,
      price: item.product.price,
    }));
  }
}
