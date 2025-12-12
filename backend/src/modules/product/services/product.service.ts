import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductQueryDto } from '../dto/product.dto';
import { getFirstTwoWords } from 'src/utils/helpers';
import { RedisService } from 'src/modules/redis/service/redis.service';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async searchProduct(query: string) {
    const redis = this.redisService.getClient();
    const key = `search:${query}`;

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    if (!query?.trim()) return [];

    const rawQuery = query
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(' & ');
    if (rawQuery === ':*') return [];
    const results = await this.prismaService.$queryRaw`
    SELECT id, title, primary_image,
      ts_rank(
        setweight(to_tsvector('english', title), 'A'),
        to_tsquery('english', ${rawQuery})
      ) +
      ts_rank(
        setweight(to_tsvector('english', about_item), 'B'),
        plainto_tsquery('english', ${query})
      ) AS rank
    FROM "Product"
    WHERE
      setweight(to_tsvector('english', title), 'A') @@ to_tsquery('english', ${rawQuery})
      OR
      setweight(to_tsvector('english', about_item), 'B') @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC;
  `;
    await redis.set(key, JSON.stringify(results), 'EX', 300);
    return results;
  }
  async getAllProducts() {
    const redis = this.redisService.getClient();
    const cacheKey = `product:all`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const products = await this.prismaService.product.findMany();
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);
    return products;
  }

  async getProduct(productId: string) {
    const redis = this.redisService.getClient();
    const cacheKey = `product:${productId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const productData = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: {
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!productData) return null;

    const result = {
      ...productData,
      title: getFirstTwoWords(productData.title),
      comments: productData.comments.map((comment) => ({
        id: comment.id,
        name: `${comment.user.firstName} ${comment.user.lastName}`,
        avatar: comment.user.image,
        rate: comment.rating,
        content: comment.content,
      })),
    };
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    return result;
  }

  async getProducts(query: ProductQueryDto) {
    const redis = this.redisService.getClient();
    const cacheKey = `products:${JSON.stringify(query)}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const filters: any = {};
    let orderBy;

    if (query.category) {
      filters.categoriesText = {
        contains: query.category,
        mode: 'insensitive',
      };
    }

    if (query.minPrice !== null && query.maxPrice !== null) {
      filters.price = {
        gte: query.minPrice,
        lte: query.maxPrice,
      };
    }

    switch (query.order) {
      case 'rate_asc':
        orderBy = { rate: 'asc' };
        break;
      case 'rate_desc':
        orderBy = { rate: 'desc' };
        break;
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'date_asc':
        orderBy = { date: 'asc' };
        break;
      case 'date_desc':
        orderBy = { date: 'desc' };
        break;
      default:
        orderBy = { rate: 'desc' };
        break;
    }

    const products = await this.prismaService.product.findMany({
      where: filters,
      orderBy: orderBy,
    });

    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);

    return products;
  }
}
