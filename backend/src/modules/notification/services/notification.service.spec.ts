import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService, NotificationType } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from '../gateways/notification.gateway';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;
  let notificationGateway: NotificationGateway;

  // Mock data
  const mockAdmin = {
    id: 'admin-123',
    email: 'admin@example.com',
    notifyOrders: true,
    notifyNewUsers: true,
    notifyReviews: false,
  };

  const mockNotification = {
    id: 'notification-123',
    adminId: 'admin-123',
    type: 'order' as NotificationType,
    title: 'New Order Received',
    message: 'User placed an order for $99.99',
    data: { orderId: 1, total: 99.99 },
    read: false,
    createdAt: new Date('2024-01-01'),
  };

  const mockReadNotification = {
    ...mockNotification,
    id: 'notification-456',
    read: true,
  };

  // Mock PrismaService
  const mockPrismaService = {
    admin: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  // Mock NotificationGateway
  const mockNotificationGateway = {
    emitToAdmins: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationGateway,
          useValue: mockNotificationGateway,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationGateway = module.get<NotificationGateway>(NotificationGateway);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== notifyAdmins Tests ====================
  describe('notifyAdmins', () => {
    const notificationData = {
      type: 'order' as NotificationType,
      title: 'New Order Received',
      message: 'User placed an order for $99.99',
      data: { orderId: 1, total: 99.99 },
    };

    it('should create notifications for all eligible admins', async () => {
      const admins = [{ id: 'admin-123' }, { id: 'admin-456' }];
      mockPrismaService.admin.findMany.mockResolvedValue(admins);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      const result = await service.notifyAdmins(notificationData);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyOrders: true },
        select: { id: true },
      });
      expect(mockPrismaService.notification.create).toHaveBeenCalledTimes(2);
    });

    it('should return empty array if no eligible admins', async () => {
      mockPrismaService.admin.findMany.mockResolvedValue([]);

      const result = await service.notifyAdmins(notificationData);

      expect(result).toEqual([]);
      expect(mockPrismaService.notification.create).not.toHaveBeenCalled();
    });

    it('should emit real-time notifications to connected admins', async () => {
      const admins = [{ id: 'admin-123' }];
      mockPrismaService.admin.findMany.mockResolvedValue(admins);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyAdmins(notificationData);

      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-123'],
        'newNotification',
        expect.objectContaining({
          type: 'order',
          title: 'New Order Received',
          read: false,
        }),
      );
    });

    it('should emit updated unread count for each admin', async () => {
      const admins = [{ id: 'admin-123' }, { id: 'admin-456' }];
      mockPrismaService.admin.findMany.mockResolvedValue(admins);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(5);

      await service.notifyAdmins(notificationData);

      // Should emit unreadCount for each admin
      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-123'],
        'unreadCount',
        5,
      );
      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-456'],
        'unreadCount',
        5,
      );
    });

    it('should use correct preference field for user notifications', async () => {
      const userNotificationData = {
        type: 'user' as NotificationType,
        title: 'New User',
        message: 'A new user registered',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([]);

      await service.notifyAdmins(userNotificationData);

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyNewUsers: true },
        select: { id: true },
      });
    });

    it('should use correct preference field for review notifications', async () => {
      const reviewNotificationData = {
        type: 'review' as NotificationType,
        title: 'New Review',
        message: 'A new review was posted',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([]);

      await service.notifyAdmins(reviewNotificationData);

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyReviews: true },
        select: { id: true },
      });
    });

    it('should handle empty data field', async () => {
      const dataWithoutExtra = {
        type: 'order' as NotificationType,
        title: 'New Order',
        message: 'Order received',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyAdmins(dataWithoutExtra);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          data: {},
        }),
      });
    });
  });

  // ==================== notifyNewOrder Tests ====================
  describe('notifyNewOrder', () => {
    const orderData = {
      id: 1,
      total: 99.99,
      userId: 'user-123',
    };

    it('should create notification with correct order data', async () => {
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewOrder(orderData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'order',
          title: 'New Order Received',
          message: expect.stringContaining('$99.99'),
          data: expect.objectContaining({
            orderId: 1,
            total: 99.99,
            userId: 'user-123',
          }),
        }),
      });
    });

    it('should format total with two decimal places', async () => {
      const orderWithRoundTotal = { id: 1, total: 100, userId: 'user-123' };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewOrder(orderWithRoundTotal);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          message: expect.stringContaining('$100.00'),
        }),
      });
    });
  });

  // ==================== notifyNewUser Tests ====================
  describe('notifyNewUser', () => {
    it('should use full name when firstName and lastName are provided', async () => {
      const userData = {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewUser(userData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'user',
          title: 'New User Registered',
          message: 'John Doe has created an account',
        }),
      });
    });

    it('should use email when firstName is missing', async () => {
      const userData = {
        id: 1,
        email: 'john@example.com',
        lastName: 'Doe',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewUser(userData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          message: 'john@example.com has created an account',
        }),
      });
    });

    it('should use email when lastName is missing', async () => {
      const userData = {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewUser(userData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          message: 'john@example.com has created an account',
        }),
      });
    });

    it('should include user data in notification data field', async () => {
      const userData = {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewUser(userData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          data: {
            userId: 1,
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        }),
      });
    });
  });

  // ==================== notifyNewReview Tests ====================
  describe('notifyNewReview', () => {
    const reviewData = {
      id: 1,
      productId: 'product-123',
      rating: 5,
      customerName: 'Jane Smith',
    };

    it('should create notification with correct review data', async () => {
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewReview(reviewData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'review',
          title: 'New Product Review',
          message: expect.stringContaining('5-star review'),
          data: expect.objectContaining({
            reviewId: 1,
            productId: 'product-123',
            rating: 5,
            customerName: 'Jane Smith',
          }),
        }),
      });
    });

    it('should include customer name in message', async () => {
      mockPrismaService.admin.findMany.mockResolvedValue([{ id: 'admin-123' }]);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.notifyNewReview(reviewData);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          message: expect.stringContaining('Jane Smith'),
        }),
      });
    });
  });

  // ==================== getNotifications Tests ====================
  describe('getNotifications', () => {
    it('should return paginated notifications', async () => {
      const notifications = [mockNotification, mockReadNotification];
      mockPrismaService.notification.findMany.mockResolvedValue(notifications);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(2) // total
        .mockResolvedValueOnce(1); // unread

      const result = await service.getNotifications('admin-123');

      expect(result.notifications).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
      expect(result.unreadCount).toBe(1);
    });

    it('should filter by unreadOnly when specified', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([
        mockNotification,
      ]);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      await service.getNotifications('admin-123', { unreadOnly: true });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-123', read: false },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should use custom pagination values', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(25);

      const result = await service.getNotifications('admin-123', {
        page: 3,
        limit: 10,
      });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-123' },
        orderBy: { createdAt: 'desc' },
        skip: 20, // (3-1) * 10
        take: 10,
      });
      expect(result.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 50,
        totalPages: 5,
      });
    });

    it('should use default values when options not provided', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      await service.getNotifications('admin-123');

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-123' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should calculate totalPages correctly', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(25) // total
        .mockResolvedValueOnce(10); // unread

      const result = await service.getNotifications('admin-123', { limit: 10 });

      expect(result.pagination.totalPages).toBe(3); // ceil(25/10)
    });
  });

  // ==================== getUnreadCount Tests ====================
  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('admin-123');

      expect(result).toBe(5);
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { adminId: 'admin-123', read: false },
      });
    });

    it('should return 0 when no unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('admin-123');

      expect(result).toBe(0);
    });
  });

  // ==================== markAsRead Tests ====================
  describe('markAsRead', () => {
    const notificationIds = ['notification-123', 'notification-456'];

    it('should mark specified notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 2 });
      mockPrismaService.notification.count.mockResolvedValue(3);

      const result = await service.markAsRead('admin-123', notificationIds);

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: notificationIds },
          adminId: 'admin-123',
        },
        data: { read: true },
      });
    });

    it('should emit updated unread count', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 2 });
      mockPrismaService.notification.count.mockResolvedValue(3);

      await service.markAsRead('admin-123', notificationIds);

      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-123'],
        'unreadCount',
        3,
      );
    });

    it('should only update notifications owned by the admin', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.notification.count.mockResolvedValue(0);

      await service.markAsRead('admin-123', notificationIds);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: notificationIds },
          adminId: 'admin-123', // Ensures admin ownership check
        },
        data: { read: true },
      });
    });
  });

  // ==================== markAllAsRead Tests ====================
  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead('admin-123');

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-123', read: false },
        data: { read: true },
      });
    });

    it('should emit unread count of 0', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      await service.markAllAsRead('admin-123');

      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-123'],
        'unreadCount',
        0,
      );
    });

    it('should succeed even if no unread notifications', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.markAllAsRead('admin-123');

      expect(result).toEqual({ success: true });
    });
  });

  // ==================== deleteNotification Tests ====================
  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(
        mockReadNotification,
      );
      mockPrismaService.notification.delete.mockResolvedValue(
        mockReadNotification,
      );

      const result = await service.deleteNotification(
        'admin-123',
        'notification-456',
      );

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notification-456' },
      });
    });

    it('should throw NotFoundException if notification not found', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteNotification('admin-123', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.deleteNotification('admin-123', 'non-existent'),
      ).rejects.toThrow('Notification not found');
    });

    it('should emit updated unread count if deleted notification was unread', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(
        mockNotification,
      ); // unread
      mockPrismaService.notification.delete.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(4);

      await service.deleteNotification('admin-123', 'notification-123');

      expect(mockNotificationGateway.emitToAdmins).toHaveBeenCalledWith(
        ['admin-123'],
        'unreadCount',
        4,
      );
    });

    it('should not emit unread count if deleted notification was already read', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(
        mockReadNotification,
      );
      mockPrismaService.notification.delete.mockResolvedValue(
        mockReadNotification,
      );

      await service.deleteNotification('admin-123', 'notification-456');

      expect(mockNotificationGateway.emitToAdmins).not.toHaveBeenCalled();
    });

    it('should only find notifications owned by the admin', async () => {
      mockPrismaService.notification.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteNotification('admin-123', 'notification-123'),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.notification.findFirst).toHaveBeenCalledWith({
        where: { id: 'notification-123', adminId: 'admin-123' },
      });
    });
  });

  // ==================== deleteReadNotifications Tests ====================
  describe('deleteReadNotifications', () => {
    it('should delete all read notifications', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 10 });

      const result = await service.deleteReadNotifications('admin-123');

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: { adminId: 'admin-123', read: true },
      });
    });

    it('should succeed even if no read notifications', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.deleteReadNotifications('admin-123');

      expect(result).toEqual({ success: true });
    });
  });

  // ==================== getPreferenceField Tests (private method tested indirectly) ====================
  describe('getPreferenceField (tested through notifyAdmins)', () => {
    beforeEach(() => {
      mockPrismaService.admin.findMany.mockResolvedValue([]);
    });

    it('should use notifyOrders for order type', async () => {
      await service.notifyAdmins({ type: 'order', title: 'T', message: 'M' });

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyOrders: true },
        select: { id: true },
      });
    });

    it('should use notifyNewUsers for user type', async () => {
      await service.notifyAdmins({ type: 'user', title: 'T', message: 'M' });

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyNewUsers: true },
        select: { id: true },
      });
    });

    it('should use notifyReviews for review type', async () => {
      await service.notifyAdmins({ type: 'review', title: 'T', message: 'M' });

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyReviews: true },
        select: { id: true },
      });
    });

    it('should default to notifyOrders for unknown type', async () => {
      await service.notifyAdmins({
        type: 'unknown' as NotificationType,
        title: 'T',
        message: 'M',
      });

      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { notifyOrders: true },
        select: { id: true },
      });
    });
  });

  // ==================== Edge Cases ====================
  describe('Edge Cases', () => {
    it('should handle concurrent notifications to same admin', async () => {
      const admins = [{ id: 'admin-123' }];
      mockPrismaService.admin.findMany.mockResolvedValue(admins);
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(1);

      // Simulate concurrent notifications
      const promises = [
        service.notifyNewOrder({ id: 1, total: 100, userId: 'user-1' }),
        service.notifyNewOrder({ id: 2, total: 200, userId: 'user-2' }),
      ];

      await Promise.all(promises);

      expect(mockPrismaService.notification.create).toHaveBeenCalledTimes(2);
    });

    it('should handle empty notification IDs array in markAsRead', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 0 });
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.markAsRead('admin-123', []);

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: [] },
          adminId: 'admin-123',
        },
        data: { read: true },
      });
    });

    it('should handle large page numbers in getNotifications', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5);

      const result = await service.getNotifications('admin-123', {
        page: 100,
        limit: 10,
      });

      expect(result.pagination).toEqual({
        page: 100,
        limit: 10,
        total: 10,
        totalPages: 1,
      });
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 990, // (100-1) * 10
        }),
      );
    });
  });
});