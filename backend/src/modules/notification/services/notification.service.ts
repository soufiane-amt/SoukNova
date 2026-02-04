import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from '../gateways/notification.gateway';

export type NotificationType = 'order' | 'user' | 'review';

interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Create notification for all admins who have the preference enabled
   */
  async notifyAdmins(notificationData: CreateNotificationData) {
    // Get preference field based on type
    const preferenceField = this.getPreferenceField(notificationData.type);

    const admins = await this.prisma.admin.findMany({
      where: {
        [preferenceField]: true,
      },
      select: { id: true },
    });

    if (admins.length === 0) return [];

    // Create notifications for all eligible admins
    const createdNotifications: any[] = [];
    for (const admin of admins) {
      const notification = await this.prisma.notification.create({
        data: {
          adminId: admin.id,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
        },
      });
      createdNotifications.push(notification);
    }

    // Emit real-time notifications to connected admins
    const adminIds = admins.map((admin) => admin.id);

    // Emit the new notification
    await this.notificationGateway.emitToAdmins(adminIds, 'newNotification', {
      id: createdNotifications[0]?.id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Update unread counts for each admin
    for (const adminId of adminIds) {
      const unreadCount = await this.getUnreadCount(adminId);
      this.notificationGateway.emitToAdmins(
        [adminId],
        'unreadCount',
        unreadCount,
      );
    }

    return createdNotifications;
  }

  /**
   * Notify admins about a new order
   */
  async notifyNewOrder(order: { id: number; total: number; userId: string }) {
    return this.notifyAdmins({
      type: 'order',
      title: 'New Order Received',
      message: `user: ${order.userId} placed an order for $${order.total.toFixed(2)}`,
      data: {
        orderId: order.id,
        total: order.total,
        userId: order.userId,
      },
    });
  }

  /**
   * Notify admins about a new user registration
   */
  async notifyNewUser(user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  }) {
    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email;

    return this.notifyAdmins({
      type: 'user',
      title: 'New User Registered',
      message: `${userName} has created an account`,
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  /**
   * Notify admins about a new review
   */
  async notifyNewReview(review: {
    id: number;
    productId: string;
    rating: number;
    customerName: string;
  }) {
    return this.notifyAdmins({
      type: 'review',
      title: 'New Product Review',
      message: `${review.customerName} left a ${review.rating}-star review on product :"${review.productId}"`,
      data: {
        reviewId: review.id,
        productId: review.productId,
        rating: review.rating,
        customerName: review.customerName,
      },
    });
  }

  /**
   * Get notifications for an admin
   */
  async getNotifications(
    adminId: string,
    options: { unreadOnly?: boolean; page?: number; limit?: number } = {},
  ) {
    const { unreadOnly = false, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = { adminId };
    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { adminId, read: false },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Get unread notification count for an admin
   */
  async getUnreadCount(adminId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { adminId, read: false },
    });
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(adminId: string, notificationIds: string[]) {
    await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        adminId, // Ensure admin owns these notifications
      },
      data: { read: true },
    });

    // Emit updated unread count
    const unreadCount = await this.getUnreadCount(adminId);
    this.notificationGateway.emitToAdmins(
      [adminId],
      'unreadCount',
      unreadCount,
    );

    return { success: true };
  }

  /**
   * Mark all notifications as read for an admin
   */
  async markAllAsRead(adminId: string) {
    await this.prisma.notification.updateMany({
      where: { adminId, read: false },
      data: { read: true },
    });

    // Emit updated unread count (should be 0)
    this.notificationGateway.emitToAdmins([adminId], 'unreadCount', 0);

    return { success: true };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(adminId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, adminId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    // Emit updated unread count if deleted notification was unread
    if (!notification.read) {
      const unreadCount = await this.getUnreadCount(adminId);
      this.notificationGateway.emitToAdmins(
        [adminId],
        'unreadCount',
        unreadCount,
      );
    }

    return { success: true };
  }

  /**
   * Delete all read notifications for an admin
   */
  async deleteReadNotifications(adminId: string) {
    await this.prisma.notification.deleteMany({
      where: { adminId, read: true },
    });

    return { success: true };
  }

  /**
   * Get preference field name based on notification type
   */
  private getPreferenceField(type: NotificationType): string {
    switch (type) {
      case 'order':
        return 'notifyOrders';
      case 'user':
        return 'notifyNewUsers';
      case 'review':
        return 'notifyReviews';
      default:
        return 'notifyOrders';
    }
  }
}
