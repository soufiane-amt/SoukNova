import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  private cache = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  async addToWishlist(userId: number, productId: string) {
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

  async getWishlist(userId: number) {
    const productsIds = await this.prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });
    const wishlists:any = [];
    for (const item of productsIds) {
      if (this.cache.has(item.productId)) {
        console.log('Serving from cache');
        return this.cache.get(item.productId);
      }
      const res = await fetch(
        `https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1/products?id=eq.${item.productId}`,
      );
      const [data] = await res.json();

      this.cache.set(item.productId, data);

      wishlists.push(data);
    }

    console.log('wishlists : ', wishlists);
    return wishlists;
  }
}
