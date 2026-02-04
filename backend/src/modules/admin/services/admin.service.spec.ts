import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { CreateProductDto } from '../dto/create-product.dto';

// Mock bcrypt
jest.mock('bcrypt');

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('AdminService', () => {
  let service: AdminService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // Mock data
  const mockAdmin = {
    id: 'admin-123',
    email: 'admin@example.com',
    password: 'hashedPassword123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    avatar: '/uploads/avatars/avatar-123.jpg',
    notifyOrders: true,
    notifyNewUsers: true,
    notifyReviews: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    image: '/uploads/avatars/user.jpg',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    _count: { orders: 2 },
    orders: [{ price: 100 }, { price: 150 }],
  };

  const mockProduct = {
    id: 'product-123',
    title: 'Test Product Name',
    price: 99.99,
    primary_image: '/uploads/products/image1.jpg',
    images: ['/uploads/products/image2.jpg'],
    categories: ['Electronics'],
    availability: 'Available',
    about_item: 'Test description',
    addedAt: new Date('2024-01-01'),
  };

  const mockOrder = {
    id: 1,
    userId: 1,
    price: 199.99,
    addedAt: new Date('2024-01-01'),
    user: {
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
    items: [
      {
        productId: 'product-123',
        quantity: 2,
        unitPrice: 99.99,
        total: 199.98,
        product: mockProduct,
      },
    ],
  };

  // Mock PrismaService
  const mockPrismaService = {
    admin: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      deleteMany: jest.fn(),
    },
    wishlist: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    comment: {
      deleteMany: jest.fn(),
    },
    session: {
      findMany: jest.fn(),
    },
  };

  // Mock JwtService
  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== Authentication Tests ====================
  describe('signIn', () => {
    const credentials = {
      email: 'admin@example.com',
      password: 'password123',
    };

    it('should return access token for valid credentials', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token-123');

      const result = await service.signIn(credentials);

      expect(result).toEqual({ access_token: 'jwt-token-123' });
      expect(mockPrismaService.admin.findUnique).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        mockAdmin.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockAdmin.id,
        username: mockAdmin.email,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.signIn(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(credentials)).rejects.toThrow(
        'Invalid credentials!',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ==================== Customers Tests ====================
  describe('getCustomers', () => {
    const mockUsers = [
      mockUser,
      { ...mockUser, id: 2, email: 'user2@example.com' },
    ];

    it('should return paginated customers', async () => {
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(2);

      const result = await service.getCustomers(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should calculate correct ordersCount and totalSpent', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      mockPrismaService.user.count.mockResolvedValue(1);

      const result = await service.getCustomers(1, 10);

      expect(result.data[0].ordersCount).toBe(2);
      expect(result.data[0].totalSpent).toBe(250); // 100 + 150
    });

    it('should filter customers by search term', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      mockPrismaService.user.count.mockResolvedValue(1);

      await service.getCustomers(1, 10, 'Jane');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { email: { contains: 'Jane', mode: 'insensitive' } },
              { firstName: { contains: 'Jane', mode: 'insensitive' } },
              { lastName: { contains: 'Jane', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should use default pagination values', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.getCustomers();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should calculate correct pagination skip value', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.getCustomers(3, 20);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40, // (3-1) * 20
          take: 20,
        }),
      );
    });
  });

  // ==================== Orders Tests ====================
  describe('getOrders', () => {
    const mockOrders = [mockOrder, { ...mockOrder, id: 2 }];

    it('should return paginated orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);
      mockPrismaService.order.count.mockResolvedValue(2);

      const result = await service.getOrders(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.data[0]).toHaveProperty('status', 'COMPLETED');
    });

    it('should search orders by order id (numeric)', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);

      await service.getOrders(1, 10, '123');

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([{ id: 123 }]),
          }),
        }),
      );
    });

    it('should search orders by customer name', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);

      await service.getOrders(1, 10, 'Jane');

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              {
                user: { firstName: { contains: 'Jane', mode: 'insensitive' } },
              },
            ]),
          }),
        }),
      );
    });

    it('should map order data correctly', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);

      const result = await service.getOrders(1, 10);

      expect(result.data[0]).toEqual({
        id: mockOrder.id,
        date: mockOrder.addedAt,
        customer: {
          id: mockOrder.user.id,
          firstName: mockOrder.user.firstName,
          lastName: mockOrder.user.lastName,
          email: mockOrder.user.email,
        },
        total: mockOrder.price,
        status: 'COMPLETED',
      });
    });
  });

  describe('getOrderDetails', () => {
    it('should return order details with items', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.getOrderDetails(1);

      expect(result).toHaveProperty('id', mockOrder.id);
      expect(result).toHaveProperty('customer');
      expect(result).toHaveProperty('items');
      expect(result && result.items).toHaveLength(1);
    });

    it('should return null if order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      const result = await service.getOrderDetails(999);

      expect(result).toBeNull();
    });

    it('should truncate product names using getFirstTwoWords', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.getOrderDetails(1);

      // getFirstTwoWords should truncate "Test Product Name" to "Test Product"
      expect(result!.items[0].productName).toBe('Test Product');
    });
  });

  // ==================== Products Tests ====================
  describe('getProducts', () => {
    const mockProducts = [
      mockProduct,
      { ...mockProduct, id: 'product-456', title: 'Another Product' },
    ];

    it('should return paginated products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(2);

      const result = await service.getProducts(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter products by search term', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.getProducts(1, 10, 'Test');

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ title: { contains: 'Test', mode: 'insensitive' } }],
          },
        }),
      );
    });

    it('should truncate product titles', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.getProducts(1, 10);

      // getFirstTwoWords should truncate "Test Product Name" to "Test Product"
      expect(result.data[0].title).toBe('Test Product');
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getProductById('product-123');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-123' },
      });
    });

    it('should return null if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.getProductById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createProduct', () => {
    const createProductDto: CreateProductDto = {
      name: 'New Product',
      description: 'A new product description',
      price: 149.99,
      categories: ['Electronics'],
      status: 'In Stock',
      sku: 'SKU-123',
      dimensions: { length: '10', width: '5', height: '3', unit: 'cm' },
    };

    const mockFiles = [
      {
        filename: 'image1.jpg',
        originalname: 'test1.jpg',
        buffer: Buffer.from('test'),
      },
      {
        filename: 'image2.jpg',
        originalname: 'test2.jpg',
        buffer: Buffer.from('test'),
      },
    ] as Express.Multer.File[];

    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
    });

    it('should create a product with images', async () => {
      const newProduct = {
        ...mockProduct,
        title: createProductDto.name,
      };
      mockPrismaService.product.create.mockResolvedValue(newProduct);

      const result = await service.createProduct(createProductDto, mockFiles);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Product created successfully');
      expect(result.product).toEqual(newProduct);
    });

    it('should create upload directory if it does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.createProduct(createProductDto, mockFiles);

      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should format dimensions string correctly', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.createProduct(createProductDto, mockFiles);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            package_dimensions: '10 x 5 x 3 cm',
          }),
        }),
      );
    });

    it('should handle empty files array', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto, []);

      expect(result.success).toBe(true);
    });
  });

  describe('updateProduct', () => {
    const updateDto = {
      name: 'Updated Product',
      price: '199.99',
    };

    it('should update a product', async () => {
      const updatedProduct = { ...mockProduct, title: 'Updated Product' };
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct('product-123', updateDto, []);

      expect(result!.title).toBe('Updated Product');
    });

    it('should return null if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.updateProduct('non-existent', updateDto, []);

      expect(result).toBeNull();
    });

    it('should update images if new files provided', async () => {
      const mockFiles = [
        {
          filename: 'new-image.jpg',
          originalname: 'new.jpg',
          buffer: Buffer.from('test'),
        },
      ] as Express.Multer.File[];

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(mockProduct);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await service.updateProduct('product-123', updateDto, mockFiles);

      expect(mockPrismaService.product.update).toHaveBeenCalled();
    });

    it('should parse dimensions from string', async () => {
      const dtoWithStringDimensions = {
        ...updateDto,
        dimensions: JSON.stringify({
          length: 20,
          width: 10,
          height: 5,
          unit: 'cm',
        }),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(mockProduct);

      await service.updateProduct('product-123', dtoWithStringDimensions, []);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            package_dimensions: '20 x 10 x 5 cm',
          }),
        }),
      );
    });
  });

  describe('deleteProductAndRelations', () => {
    it('should delete product and all related records', async () => {
      mockPrismaService.wishlist.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.comment.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProductAndRelations('product-123');

      expect(result).toBe(true);
      expect(mockPrismaService.wishlist.deleteMany).toHaveBeenCalledWith({
        where: { productId: 'product-123' },
      });
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { productId: 'product-123' },
      });
      expect(mockPrismaService.comment.deleteMany).toHaveBeenCalledWith({
        where: { productId: 'product-123' },
      });
    });

    it('should return false if product deletion fails', async () => {
      mockPrismaService.wishlist.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.comment.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.product.delete.mockRejectedValue(
        new Error('Not found'),
      );

      const result = await service.deleteProductAndRelations('non-existent');

      expect(result).toBe(false);
    });
  });

  // ==================== Dashboard Tests ====================
  describe('getDashboard', () => {
    it('should return dashboard statistics', async () => {
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { price: 10000 },
      });
      mockPrismaService.order.count.mockResolvedValue(50);
      mockPrismaService.user.count.mockResolvedValue(25);
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.getDashboard();

      expect(result.stats).toEqual({
        totalRevenue: 10000,
        totalOrders: 50,
        avgOrderValue: 200, // 10000 / 50
        activeCustomers: 25,
      });
      expect(result.recentOrders).toHaveLength(1);
    });

    it('should handle zero orders', async () => {
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { price: null },
      });
      mockPrismaService.order.count.mockResolvedValue(0);
      mockPrismaService.user.count.mockResolvedValue(0);
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const result = await service.getDashboard();

      expect(result.stats.totalRevenue).toBe(0);
      expect(result.stats.avgOrderValue).toBe(0);
    });

    it('should respect recentLimit parameter', async () => {
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { price: 0 },
      });
      mockPrismaService.order.count.mockResolvedValue(0);
      mockPrismaService.user.count.mockResolvedValue(0);
      mockPrismaService.order.findMany.mockResolvedValue([]);

      await service.getDashboard(10);

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });
  });

  describe('getRevenueSeries', () => {
    it('should return empty data for no orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const result = await service.getRevenueSeries();

      expect(result).toEqual({ data: [] });
    });

    it('should aggregate revenue by date', async () => {
      const orders = [
        { addedAt: new Date('2024-01-01'), price: 100 },
        { addedAt: new Date('2024-01-01'), price: 150 },
        { addedAt: new Date('2024-01-02'), price: 200 },
      ];
      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.getRevenueSeries();

      expect(result.data).toContainEqual({ date: '2024-01-01', total: 250 });
      expect(result.data).toContainEqual({ date: '2024-01-02', total: 200 });
    });
  });

  // ==================== Customer Activity Tests ====================
  describe('getCustomerActivity', () => {
    const mockUserFull = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      createdAt: new Date('2024-01-01'),
      image: '/avatar.jpg',
      status: 'active',
    };

    it('should return customer activity data', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserFull);
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { price: 199.99 },
      });
      mockPrismaService.session.findMany.mockResolvedValue([]);
      mockPrismaService.wishlist.findMany.mockResolvedValue([]);
      mockPrismaService.cartItem.findMany.mockResolvedValue([]);

      const result = await service.getCustomerActivity(1);

      expect(result).not.toBeNull();
      expect(result!.account.id).toBe(1);
      expect(result!.orderStats.totalOrders).toBe(1);
      expect(result!.orderStats.totalSpent).toBe(199.99);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getCustomerActivity(999);

      expect(result).toBeNull();
    });

    it('should calculate average order value correctly', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserFull);
      mockPrismaService.order.findMany.mockResolvedValue([
        mockOrder,
        mockOrder,
      ]);
      mockPrismaService.order.count.mockResolvedValue(2);
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { price: 400 },
      });
      mockPrismaService.session.findMany.mockResolvedValue([]);
      mockPrismaService.wishlist.findMany.mockResolvedValue([]);
      mockPrismaService.cartItem.findMany.mockResolvedValue([]);

      const result = await service.getCustomerActivity(1);

      expect(result!.orderStats.avgOrderValue).toBe(200); // 400 / 2
    });
  });

  // ==================== User Freeze/Unfreeze Tests ====================
  describe('freezeUser', () => {
    it('should freeze a user', async () => {
      const frozenUser = { ...mockUser, status: 'frozen' };
      mockPrismaService.user.update.mockResolvedValue(frozenUser);

      const result = await service.freezeUser(1);

      expect(result.status).toBe('frozen');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'frozen' },
      });
    });
  });

  describe('unFreezeUser', () => {
    it('should unfreeze a user', async () => {
      const activeUser = { ...mockUser, status: 'active' };
      mockPrismaService.user.update.mockResolvedValue(activeUser);

      const result = await service.unFreezeUser(1);

      expect(result.status).toBe('active');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'active' },
      });
    });
  });

  describe('deleteUserAndRelations', () => {
    it('should delete user and all related records', async () => {
      mockPrismaService.wishlist.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.order.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.comment.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUserAndRelations(1);

      expect(result).toBe(true);
    });

    it('should return false if user deletion fails', async () => {
      mockPrismaService.wishlist.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.order.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.comment.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.user.delete.mockRejectedValue(new Error('Not found'));

      const result = await service.deleteUserAndRelations(999);

      expect(result).toBe(false);
    });
  });

  // ==================== Profile Tests ====================
  describe('getProfile', () => {
    it('should return admin profile', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.getProfile('admin-123');

      expect(result).toEqual({
        id: mockAdmin.id,
        firstName: mockAdmin.firstName,
        lastName: mockAdmin.lastName,
        email: mockAdmin.email,
        phone: mockAdmin.phone,
        avatar: mockAdmin.avatar,
        createdAt: mockAdmin.createdAt,
      });
    });

    it('should return null if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      const result = await service.getProfile('non-existent');

      expect(result).toBeNull();
    });

    it('should return empty strings for null fields', async () => {
      const adminWithNulls = {
        ...mockAdmin,
        firstName: null,
        lastName: null,
        phone: null,
        avatar: null,
      };
      mockPrismaService.admin.findUnique.mockResolvedValue(adminWithNulls);

      const result = await service.getProfile('admin-123');

      expect(result).not.toBeNull();
      expect(result!.firstName).toBe('');
      expect(result!.lastName).toBe('');
      expect(result!.phone).toBe('');
      expect(result!.avatar).toBe('');
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+9876543210',
    };

    it('should update admin profile', async () => {
      const updatedAdmin = { ...mockAdmin, ...updateDto };
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);

      const result = await service.updateProfile('admin-123', updateDto);

      expect(result.firstName).toBe(updateDto.firstName);
      expect(result.lastName).toBe(updateDto.lastName);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.admin.findFirst.mockResolvedValue({
        id: 'other-admin',
      });

      await expect(
        service.updateProfile('admin-123', { email: 'existing@example.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow same email if no conflict', async () => {
      mockPrismaService.admin.findFirst.mockResolvedValue(null);
      mockPrismaService.admin.update.mockResolvedValue(mockAdmin);

      const result = await service.updateProfile('admin-123', {
        email: 'new@example.com',
      });

      expect(result).toBeDefined();
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
    };

    it('should change password successfully', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true) // current password valid
        .mockResolvedValueOnce(false); // new password is different
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockPrismaService.admin.update.mockResolvedValue({
        ...mockAdmin,
        password: 'newHashedPassword',
      });

      const result = await service.changePassword(
        'admin-123',
        changePasswordDto,
      );

      expect(result).toEqual({ success: true });
      expect(bcrypt.hash).toHaveBeenCalledWith(
        changePasswordDto.newPassword,
        10,
      );
    });

    it('should throw UnauthorizedException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('non-existent', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect current password', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('admin-123', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.changePassword('admin-123', changePasswordDto),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should throw UnauthorizedException if new password same as current', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true) // current password valid
        .mockResolvedValueOnce(true); // new password is same

      await expect(
        service.changePassword('admin-123', changePasswordDto),
      ).rejects.toThrow('New password must be different from current password');
    });
  });

  // ==================== Notification Preferences Tests ====================
  describe('getNotificationPreferences', () => {
    it('should return notification preferences', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.getNotificationPreferences('admin-123');

      expect(result).toEqual({
        pushOrders: true,
        pushNewUsers: true,
        pushReviews: false,
      });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.getNotificationPreferences('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateNotificationPreferences', () => {
    const updateDto = {
      notifyOrders: false,
      notifyNewUsers: true,
      notifyReviews: true,
    };

    it('should update notification preferences', async () => {
      const updatedAdmin = {
        notifyOrders: false,
        notifyNewUsers: true,
        notifyReviews: true,
      };
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);

      const result = await service.updateNotificationPreferences(
        'admin-123',
        updateDto,
      );

      expect(result).toEqual({
        pushOrders: false,
        pushNewUsers: true,
        pushReviews: true,
      });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.updateNotificationPreferences('non-existent', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should preserve existing values when partial update', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue({
        notifyOrders: true,
        notifyNewUsers: true,
        notifyReviews: true,
      });

      await service.updateNotificationPreferences('admin-123', {
        notifyReviews: true,
      });

      expect(mockPrismaService.admin.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            notifyOrders: true, // preserved
            notifyNewUsers: true, // preserved
            notifyReviews: true, // updated
          }),
        }),
      );
    });
  });

  describe('shouldNotify', () => {
    it('should return true for enabled notification type (orders)', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.shouldNotify('admin-123', 'orders');

      expect(result).toBe(true);
    });

    it('should return false for disabled notification type (reviews)', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.shouldNotify('admin-123', 'reviews');

      expect(result).toBe(false);
    });

    it('should return false if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      const result = await service.shouldNotify('non-existent', 'orders');

      expect(result).toBe(false);
    });

    it('should handle newUsers type', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.shouldNotify('admin-123', 'newUsers');

      expect(result).toBe(true);
    });

    it('should return false for unknown type', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.shouldNotify('admin-123', 'unknown' as any);

      expect(result).toBe(false);
    });
  });

  // ==================== Avatar Tests ====================
  describe('uploadAvatar', () => {
    const mockFile = {
      filename: 'avatar-new-123.jpg',
      originalname: 'profile.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    it('should upload avatar successfully', async () => {
      const updatedAdmin = {
        ...mockAdmin,
        avatar: `/uploads/avatars/${mockFile.filename}`,
      };
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

      const result = await service.uploadAvatar('admin-123', mockFile);

      expect(result.avatar).toBe(`/uploads/avatars/${mockFile.filename}`);
      expect(fs.unlinkSync).toHaveBeenCalled(); // Old avatar should be deleted
    });

    it('should upload avatar without deleting old one if none exists', async () => {
      const adminWithoutAvatar = { ...mockAdmin, avatar: null };
      const updatedAdmin = {
        ...adminWithoutAvatar,
        avatar: `/uploads/avatars/${mockFile.filename}`,
      };
      mockPrismaService.admin.findUnique.mockResolvedValue(adminWithoutAvatar);
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);

      const result = await service.uploadAvatar('admin-123', mockFile);

      expect(result.avatar).toBe(`/uploads/avatars/${mockFile.filename}`);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadAvatar('non-existent', mockFile),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle file deletion errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue({
        ...mockAdmin,
        avatar: `/uploads/avatars/${mockFile.filename}`,
      });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      // Should not throw, just log the error
      const result = await service.uploadAvatar('admin-123', mockFile);

      expect(result).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to delete avatar file:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar successfully', async () => {
      const updatedAdmin = { ...mockAdmin, avatar: null };
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue(updatedAdmin);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

      const result = await service.deleteAvatar('admin-123');

      expect(result.avatar).toBeNull();
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should handle deletion when no avatar exists', async () => {
      const adminWithoutAvatar = { ...mockAdmin, avatar: null };
      mockPrismaService.admin.findUnique.mockResolvedValue(adminWithoutAvatar);
      mockPrismaService.admin.update.mockResolvedValue(adminWithoutAvatar);

      const result = await service.deleteAvatar('admin-123');

      expect(result.avatar).toBeNull();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.deleteAvatar('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not throw if file does not exist on disk', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.update.mockResolvedValue({
        ...mockAdmin,
        avatar: null,
      });
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await service.deleteAvatar('admin-123');

      expect(result.avatar).toBeNull();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
