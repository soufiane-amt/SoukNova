import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/modules/redis/service/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { splitTextIntoParagraphs } from 'src/utils/helpers';

@Injectable()
export class ArticleService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async getArticlesPaginated(page: number, pageSize: number) {
    const redis = this.redisService.getClient();
    const key = `articles:page=${page}-pageSize=${pageSize}`;

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    const skip = (page - 1) * pageSize;
    const [totalCount, articles] = await Promise.all([
      await this.prismaService.article.count(),
      await this.prismaService.article.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          date: true,
          images: true,
        },
      }),
    ]);

    const formatted = articles.map((article) => ({
      id: article.id,
      title: article.title,
      date: article.date,
      image: article.images?.[0] ?? null,
    }));

    const results = {
      articles: formatted,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
    await redis.set(key, JSON.stringify(results), 'EX', 300);

    return results;
  }

  async getArticles() {
    const redis = this.redisService.getClient();
    const key = 'articles:list';

    const cached = await redis.get(key);
    if (cached) {
      console.log('Found articles in cache');
      return JSON.parse(cached);
    }

    const articles = await this.prismaService.article.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        images: true,
      },
    });

    const formatted = articles.map((article) => ({
      ...article,
      image: article.images?.[0] ?? null,
    }));

    await redis.set(key, JSON.stringify(formatted), 'EX', 300);

    return formatted;
  }

  async getArticle(articleId: number) {
    const redis = this.redisService.getClient();
    const key = `article:${articleId}`;

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const article = await this.prismaService.article.findUnique({
      where: { id: articleId },
    });

    const formatted = {
      title: article?.title,
      author: article?.author,
      date: article?.date,
      images: article?.images,
      article_paragraphs: splitTextIntoParagraphs(article?.text),
    };

    await redis.set(key, JSON.stringify(formatted), 'EX', 600);

    return formatted;
  }

  async getRandomArticles(excludeId: number) {
    return this.prismaService.$queryRaw`
      SELECT id, title, images[1] as image
      FROM "article"
      WHERE id != ${excludeId}
      ORDER BY RANDOM()
      LIMIT 3;
    `;
  }
}
