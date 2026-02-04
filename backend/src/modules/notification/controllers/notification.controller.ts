import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseBoolPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../gateways/notification.gateway';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { MarkNotificationsReadDto } from '../dto/mark-notifications-read.dto';
import { User } from 'src/modules/users/user.decorator';

@Controller('api/admin/notifications')
@UseGuards(AdminGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * GET /api/admin/notifications
   * Get all notifications for the admin
   */
  @Get()
  async getNotifications(
    @User('id') adminId: string,
    @Query('unreadOnly', new DefaultValuePipe(false), ParseBoolPipe) unreadOnly: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const result = await this.notificationService.getNotifications(adminId, {
      unreadOnly,
      page,
      limit,
    });

    return {
      success: true,
      data: result.notifications,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
    };
  }

  /**
   * GET /api/admin/notifications/unread-count
   * Get unread notification count
   */
  @Get('unread-count')
  async getUnreadCount(@User('id') adminId: string) {
    const count = await this.notificationService.getUnreadCount(adminId);

    return {
      success: true,
      data: { count },
    };
  }

  /**
   * POST /api/admin/notifications/mark-read
   * Mark specific notifications as read
   */
  @Post('mark-read')
  async markAsRead(
    @User('id') adminId: string,
    @Body() dto: MarkNotificationsReadDto,
  ) {
    await this.notificationService.markAsRead(adminId, dto.notificationIds);

    return {
      success: true,
      message: 'Notifications marked as read',
    };
  }

  /**
   * POST /api/admin/notifications/mark-all-read
   * Mark all notifications as read
   */
  @Post('mark-all-read')
  async markAllAsRead(@User('id') adminId: string) {
    await this.notificationService.markAllAsRead(adminId);

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  /**
   * DELETE /api/admin/notifications/:id
   * Delete a specific notification
   */
  @Delete(':id')
  async deleteNotification(
    @User('id') adminId: string,
    @Param('id') notificationId: string,
  ) {
    await this.notificationService.deleteNotification(adminId, notificationId);

    return {
      success: true,
      message: 'Notification deleted',
    };
  }

  /**
   * DELETE /api/admin/notifications/read
   * Delete all read notifications
   */
  @Delete('read/all')
  async deleteReadNotifications(@User('id') adminId: string) {
    await this.notificationService.deleteReadNotifications(adminId);

    return {
      success: true,
      message: 'Read notifications deleted',
    };
  }

  /**
   * Debug endpoint - no auth required
   */
  @Get('socket-status')
  getSocketStatus() {
    return {
      success: true,
      message: 'Socket.IO gateway is loaded',
      gatewayInitialized: !!this.notificationGateway.server,
    };
  }
}