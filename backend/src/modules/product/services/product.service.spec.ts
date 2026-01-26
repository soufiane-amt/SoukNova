import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/service/redis.service';

describe('ProductService', () => {
  let service: ProductService;
  let prismaMock: any;
  let redisMock: any;
  let redisClientMock: any;

  beforeEach(async () => {
    redisClientMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    redisMock = {
      getClient: jest.fn(() => redisClientMock),
    };
    prismaMock = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      comment: {
        findMany: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached search results if available', async () => {
    redisClientMock.get.mockResolvedValueOnce(
      JSON.stringify([{ id: '1', title: 'Cached' }]),
    );
    const result = await service.searchProduct('test');
    expect(redisClientMock.get).toHaveBeenCalledWith('search:test');
    expect(result).toEqual([{ id: '1', title: 'Cached' }]);
  });

  it('should query and cache search results if not cached', async () => {
    redisClientMock.get.mockResolvedValueOnce(null);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id: '2', title: 'DB' }]);
    redisClientMock.set.mockResolvedValueOnce('OK');
    const result = await service.searchProduct('test');
    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    expect(redisClientMock.set).toHaveBeenCalled();
    expect(result).toEqual([{ id: '2', title: 'DB' }]);
  });

  it('should return empty array for empty query', async () => {
    const result = await service.searchProduct('');
    expect(result).toEqual([]);
  });

  it('should return cached products if available', async () => {
    redisClientMock.get.mockResolvedValueOnce(
      JSON.stringify([{ id: '1', title: 'Cached Product' }]),
    );
    const result = await service.getAllProducts();
    expect(redisClientMock.get).toHaveBeenCalledWith('product:all');
    expect(result).toEqual([{ id: '1', title: 'Cached Product' }]);
  });

  it('should fetch and cache all products if not cached', async () => {
    redisClientMock.get.mockResolvedValueOnce(null);
    prismaMock.product.findMany.mockResolvedValueOnce([
      { id: '2', title: 'DB Product' },
    ]);
    redisClientMock.set.mockResolvedValueOnce('OK');
    const result = await service.getAllProducts();
    expect(prismaMock.product.findMany).toHaveBeenCalled();
    expect(redisClientMock.set).toHaveBeenCalled();
    expect(result).toEqual([{ id: '2', title: 'DB Product' }]);
  });

  it('should return null if product not found', async () => {
    redisClientMock.get.mockResolvedValueOnce(null);
    prismaMock.product.findUnique.mockResolvedValueOnce(null);
    const result = await service.getProduct('notfound');
    expect(result).toBeNull();
  });

  it('should return product with comments and rate', async () => {
    redisClientMock.get.mockResolvedValueOnce(null);
    prismaMock.product.findUnique.mockResolvedValueOnce({
      id: 'p1',
      title: 'Test Product',
      price: 100,
      discount: '0',
      rate: 4,
      primary_image: 'img.png',
      addedAt: new Date(),
    });
    prismaMock.comment.findMany.mockResolvedValueOnce([
      {
        id: 1,
        rating: 5,
        content: 'Great!',
        user: { firstName: 'A', lastName: 'B', image: 'img1' },
      },
      {
        id: 2,
        rating: 3,
        content: 'Ok',
        user: { firstName: 'C', lastName: 'D', image: 'img2' },
      },
    ]);
    redisClientMock.set.mockResolvedValueOnce('OK');
    const result = await service.getProduct('p1');
    expect(result).toHaveProperty('id', 'p1');
    expect(result).toHaveProperty('comments');
    expect(result.comments.length).toBe(2);
    expect(result).toHaveProperty('rate', 4); // (5+3)/2
  });

  it('should return cached products for getProducts', async () => {
    redisClientMock.get.mockResolvedValueOnce(
      JSON.stringify({ products: [], totalPages: 1 }),
    );
    const result = await service.getProducts({ page: 1, pageSize: 12 });
    expect(result).toEqual({ products: [], totalPages: 1 });
  });

  it('should fetch and cache products for getProducts', async () => {
    redisClientMock.get.mockResolvedValueOnce(null);
    prismaMock.product.count.mockResolvedValueOnce(2);
    prismaMock.product.findMany.mockResolvedValueOnce([
      {
        id: 'p1',
        title: 'T1',
        price: 100,
        discount: '10',
        rate: 4,
        primary_image: 'img',
        date: new Date(),
      },
      {
        id: 'p2',
        title: 'T2',
        price: 200,
        discount: '',
        rate: 5,
        primary_image: 'img',
        date: new Date(),
      },
    ]);
    redisClientMock.set.mockResolvedValueOnce('OK');
    const result = await service.getProducts({ page: 1, pageSize: 2 });
    expect(result.products.length).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(redisClientMock.set).toHaveBeenCalled();
  });

  it('should get recent products', async () => {
    prismaMock.product.findMany.mockResolvedValueOnce([
      {
        id: 'p1',
        title: 'T1',
        price: 100,
        discount: '0',
        rate: 4,
        primary_image: 'img',
        addedAt: new Date(),
      },
      {
        id: 'p2',
        title: 'T2',
        price: 200,
        discount: '0',
        rate: 5,
        primary_image: 'img',
        addedAt: new Date(),
      },
    ]);
    const result = await service.getRecentProducts();
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('price');
  });
});
