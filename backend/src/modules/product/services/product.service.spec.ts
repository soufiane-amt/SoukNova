import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  const now = new Date();

  const prismaMock: any = {
    $queryRaw: jest.fn(),
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  const redisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
  };
  const redisServiceMock = { getClient: () => redisClient };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    })
      .useMocker((token) => {
        if (token === PrismaService) return prismaMock;
        if (token === RedisService) return redisServiceMock;
      })
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('searchProduct', () => {
    it('returns cached result when present', async () => {
      const cached = [{ id: 'x' }];
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
      const res = await service.searchProduct('test');
      expect(redisClient.get).toHaveBeenCalledWith('search:test');
      expect(res).toEqual(cached);
    });

    it('returns empty array for empty query', async () => {
      const res = await service.searchProduct('   ');
      expect(res).toEqual([]);
    });

    it('queries db and caches result when not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 'p1', title: 'T' }]);

      const res = await service.searchProduct('chair');

      expect(prismaMock.$queryRaw).toHaveBeenCalled();
      expect(redisClient.set).toHaveBeenCalledWith('search:chair', expect.any(String), 'EX', 300);
      expect(res).toEqual([{ id: 'p1', title: 'T' }]);
    });
  });

  describe('getAllProducts', () => {
    it('returns cached when present', async () => {
      const cached = [{ id: 'all1' }];
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
      const res = await service.getAllProducts();
      expect(redisClient.get).toHaveBeenCalledWith('product:all');
      expect(res).toEqual(cached);
    });

    it('fetches from db and caches when not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.product.findMany.mockResolvedValueOnce([{ id: 'p2' }]);
      const res = await service.getAllProducts();
      expect(prismaMock.product.findMany).toHaveBeenCalled();
      expect(redisClient.set).toHaveBeenCalledWith('product:all', expect.any(String), 'EX', 3600);
      expect(res).toEqual([{ id: 'p2' }]);
    });
  });

  describe('getProduct', () => {
    it('returns cached when present', async () => {
      const cached = { id: 'x', title: 't' };
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
      const res = await service.getProduct('x');
      expect(redisClient.get).toHaveBeenCalledWith('product:x');
      expect(res).toEqual(cached);
    });

    it('returns null when product not found', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.product.findUnique.mockResolvedValueOnce(null);
      const res = await service.getProduct('missing');
      expect(res).toBeNull();
    });

    it('fetches product, transforms and caches when not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      const productDb = {
        id: 'p1',
        title: 'Hello World Product',
        primary_image: 'img.png',
        comments: [
          { id: 1, content: 'c', rating: 5, user: { firstName: 'A', lastName: 'B', image: 'av.png' } },
        ],
      } as any;
      prismaMock.product.findUnique.mockResolvedValueOnce(productDb);

      const res = await service.getProduct('p1');
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({ where: { id: 'p1' }, include: { comments: { include: { user: true } } } });
      expect(redisClient.set).toHaveBeenCalledWith('product:p1', expect.any(String), 'EX', 3600);
      expect(res.title).toBe('Hello World');
      expect(res.comments[0]).toEqual({ id: 1, name: 'A B', avatar: 'av.png', rate: 5, content: 'c' });
    });
  });

  describe('getProducts', () => {
    it('returns cached when present', async () => {
      const cached = { products: [], totalPages: 1 };
      const query = { page: 1, pageSize: 10 } as any;
      redisClient.get.mockResolvedValueOnce(JSON.stringify(cached));
      const res = await service.getProducts(query);
      expect(redisClient.get).toHaveBeenCalled();
      expect(res).toEqual(cached);
    });

    it('fetches products, formats price and caches when not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      prismaMock.product.count.mockResolvedValueOnce(3);
      prismaMock.product.findMany.mockResolvedValueOnce([
        { id: 'p1', price: 100, discount: '10', title: 'T', rate: 4, primary_image: 'i', date: now },
      ] as any);

      const query = { page: 1, pageSize: 10 } as any;
      const res = await service.getProducts(query);

      expect(prismaMock.product.count).toHaveBeenCalledWith({ where: {} });
      expect(prismaMock.product.findMany).toHaveBeenCalled();
      expect(res.products[0]).toHaveProperty('price');
      expect(res.totalPages).toBe(Math.ceil(3 / 10));
      expect(redisClient.set).toHaveBeenCalled();
    });
  });

  describe('getRecentProducts', () => {
    it('returns transformed recent products', async () => {
      prismaMock.product.findMany.mockResolvedValueOnce([
        { id: 'r1', title: 'X', price: 5, addedAt: now, discount: '', rate: 4, primary_image: 'img' },
      ] as any);

      const res = await service.getRecentProducts();
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({ take: 10, orderBy: { addedAt: 'desc' } });
      expect(res[0]).toHaveProperty('id', 'r1');
      expect(res[0]).toHaveProperty('date', now);
    });
  });
});
