import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductQueryDto } from '../dto/product.dto';
import { getFirstTwoWords } from 'src/utils/helpers';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

async searchProduct(query: string) {
  if (!query?.trim()) return [];

  const rawQuery = query
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map(word => `${word}:*`)
    .join(' & ');
  if (rawQuery === ":*")
    return []
  return this.prismaService.$queryRaw`
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
}
  async getAllProducts() {
    return this.prismaService.product.findMany();
  }
  async getProduct(productId: string) {
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
    return {
      ...productData,
      title: getFirstTwoWords(productData?.title),
      comments: productData?.comments.map((comment) => ({
        id: comment.id,
        name: `${comment.user.firstName} ${comment.user.lastName}`,
        avatar: comment.user.image,
        rate: comment.rating,
        content: comment.content
      })),
    };
  }
  async getProducts(query: ProductQueryDto) {
    const filters: any = {};
    let orderBy;

    if (query.category)
      filters.categoriesText = {
        contains: query.category,
        mode: 'insensitive',
      };
    if (query.minPrice !== null && query.maxPrice !== null)
      filters.price = {
        gte: query.minPrice,
        lte: query.maxPrice,
      };
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
    return this.prismaService.product.findMany({
      where: filters,
      orderBy: orderBy,
    });
  }
}
