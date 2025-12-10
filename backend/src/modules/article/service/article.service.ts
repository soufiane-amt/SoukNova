import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { splitTextIntoParagraphs } from 'src/utils/helpers';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}
  async getArticles() {
    const articles = await this.prismaService.article.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        images: true,
      },
    });

    return articles.map((article) => ({
      ...article,
      image: article.images?.[0] ?? null,
    }));
  }

  async getArticle(articleId: number) {
    const article = await this.prismaService.article.findUnique({
      where: {
        id: articleId,
      },
    });
    return {
      title: article?.title,
      author: article?.author,
      date: article?.date,
      images: article?.images,
      article_paragraphs: splitTextIntoParagraphs(article?.text),
    };
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
