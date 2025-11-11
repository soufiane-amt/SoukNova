import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WishItemType } from '../dto/wish-item.dto';
import { SUPABASE_KEY, SUPABASE_URL } from 'src/exports';

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

  async getWishlist(userId: number) {
    const productsIds = await this.prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });

    const wishlists: WishItemType[] = [];
    for (const item of productsIds) {
      if (!item.productId) continue;
      if (this.cache.has(item.productId)) {
        const cached = this.cache.get(item.productId);
        if (cached) {
          wishlists.push(cached);
          continue;
        }
        continue;
      }
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${item.productId}`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        },
      );

      const json = await res.json();
      if (!json || json.length === 0) {
        console.warn(`No product found for ${item.productId}`);
        continue;
      }

      const data = json[0];
      const product: WishItemType = {
        productId: data.id,
        productName: data.title,
        image: data.primary_image,
        price: data.Price,
      };

      this.cache.set(item.productId, product);

      wishlists.push(product);
    }

    return wishlists;
  }
}
