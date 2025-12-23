import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';

describe('ArticleService', () => {
  let service: ArticleService;

  const prismaMock: any = {
    article: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  const redisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
  };
  const redisServiceMock = { getClient: () => redisClient };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
        if (token === RedisService) return redisServiceMock;
      })
      .compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getArticlesPaginated should return cached when present', async () => {
    const cached = { articles: [], totalPages: 1 };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
    const res = await service.getArticlesPaginated(1, 10);
    expect(redisClient.get).toHaveBeenCalled();
    expect(res).toEqual(cached);
  });

  it('getArticlesPaginated should fetch from db and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.article.count.mockResolvedValueOnce(5);
    prismaMock.article.findMany.mockResolvedValueOnce([
      { id: 1, title: 'A', date: new Date(), images: ['i1'] },
    ]);

    const res = await service.getArticlesPaginated(1, 2);
    expect(prismaMock.article.count).toHaveBeenCalled();
    expect(prismaMock.article.findMany).toHaveBeenCalled();
    expect(redisClient.set).toHaveBeenCalled();
    expect(res.articles[0]).toHaveProperty('image', 'i1');
  });

  it('getArticles should return cached when present', async () => {
    const cached = [{ id: 1 }];
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
    const res = await service.getArticles();
    expect(res).toEqual(cached);
  });

  it('getArticles should fetch and transform when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.article.findMany.mockResolvedValueOnce([
      { id: 2, title: 'B', date: new Date(), images: ['img'] },
    ]);

    const res = await service.getArticles();
    expect(prismaMock.article.findMany).toHaveBeenCalled();
    expect(res[0]).toHaveProperty('image', 'img');
    expect(redisClient.set).toHaveBeenCalled();
  });

  it('getArticle should return cached when present', async () => {
    const cached = { title: 'x' };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
    const res = await service.getArticle(1);
    expect(res).toEqual(cached);
  });

  it('getArticle should fetch, split paragraphs and cache when not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    prismaMock.article.findUnique.mockResolvedValueOnce({
      id: 3,
      title: 'T',
      author: 'A',
      date: new Date(),
      images: ['i'],
      text: 'one two three four five',
    });

    const res = await service.getArticle(3);
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
    });
    expect(res.article_paragraphs.length).toBeGreaterThan(0);
    expect(redisClient.set).toHaveBeenCalled();
  });

  it('getRandomArticles should call raw query', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 9 }]);
    const res = await service.getRandomArticles(5);
    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    expect(res).toEqual([{ id: 9 }]);
  });
});
