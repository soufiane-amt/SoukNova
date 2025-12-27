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

  async clearWishlistCache(userId: number) {
    const redis = this.redisService.getClient();
    const pattern = `wishlist:user:${userId}:*`;
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const keys: string[] = [];
    for await (const arr of stream) keys.push(...arr);
    if (keys.length) await redis.unlink(...keys); // unlink is non-blocking; use del if unavailable
  }

  async addToWishlist(userId: number, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) return existing;

    const created = await this.prisma.wishlist.create({
      data: { userId, productId },
    });

    await this.clearWishlistCache(userId);
    return created;
  }

  async removeFromWishlist(userId: number, productId: string) {
    await this.clearWishlistCache(userId);

    return this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async getWishlist(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<{
    items: WishItemType[];
    totalPages: number;
  }> {
    const redis = this.redisService.getClient();

    const skip = (page - 1) * pageSize;
    const cacheKey = `wishlist:user:${userId}:page:${page}:size:${pageSize}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [totalCount, wishlistRows] = await Promise.all([
      this.prisma.wishlist.count({
        where: { userId },
      }),
      this.prisma.wishlist.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { addedAt: 'desc' },
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
      }),
    ]);

    const items: WishItemType[] = wishlistRows.map((row) => ({
      productId: row.product.id,
      productName: row.product.title,
      image: row.product.primary_image,
      price: row.product.price,
    }));

    const result = {
      items,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 5);

    return result;
  }
}
