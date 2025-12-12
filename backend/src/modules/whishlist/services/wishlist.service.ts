import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WishItemType } from '../dto/wish-item.dto';
import { RedisService } from 'src/modules/redis/service/redis.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  private getCacheKey(userId: number) {
    return `wishlist:${userId}`;
  }

  async addToWishlist(userId: number, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) return existing;

    const created = await this.prisma.wishlist.create({
      data: { userId, productId },
    });

    const redis = this.redisService.getClient();
    await redis.del(this.getCacheKey(userId));

    return created;
  }

  async removeFromWishlist(userId: number, productId: string) {
    const redis = this.redisService.getClient();
    await redis.del(this.getCacheKey(userId));

    return this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async getWishlist(userId: number): Promise<WishItemType[]> {
    const redis = this.redisService.getClient();
    const cacheKey = this.getCacheKey(userId);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

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

    const wishlist: WishItemType[] = wishListProducts.map((item) => ({
      productId: item.product.id,
      productName: item.product.title,
      image: item.product.primary_image,
      price: item.product.price,
    }));

    await redis.set(cacheKey, JSON.stringify(wishlist), 'EX', 60 * 5);
    return wishlist;
  }
}
