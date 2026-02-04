import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Delete,
  Param,
  NotFoundException,
  Patch,
  Res,
  ConflictException,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from '../services/admin.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Response } from 'express';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from 'src/modules/users/user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() adminCredentials: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.adminService.signIn(adminCredentials);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Login successful' };
  }

  @UseGuards(AdminGuard)
  @Get('customers')
  async getCustomers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getCustomers(page, limit, search);
  }

  @UseGuards(AdminGuard)
  @Get('orders')
  async getOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getOrders(page, limit, search);
  }

  @UseGuards(AdminGuard)
  @Get('products')
  async getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProducts(page, limit, search);
  }

  @UseGuards(AdminGuard)
  @Post('products')
  @UseInterceptors(FilesInterceptor('images', 13)) // 1 primary + 12 secondary max
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one product image is required');
    }
    return this.adminService.createProduct(createProductDto, files);
  }

  @UseGuards(AdminGuard)
  @Get('dashboard')
  async getDashboard(
    @Query('recent', new DefaultValuePipe(5), ParseIntPipe) recent = 5,
  ) {
    return this.adminService.getDashboard(recent);
  }

  @UseGuards(AdminGuard)
  @Get('revenue')
  async getRevenueSeries() {
    return this.adminService.getRevenueSeries();
  }

  @UseGuards(AdminGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.adminService.deleteUserAndRelations(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { success: true, message: 'User and related data deleted' };
  }

  @UseGuards(AdminGuard)
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    const deleted = await this.adminService.deleteProductAndRelations(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product and related data deleted' };
  }

  @UseGuards(AdminGuard)
  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.adminService.getProductById(id);
    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }

  @UseGuards(AdminGuard)
  @Patch('products/:id')
  @UseInterceptors(FilesInterceptor('images', 13))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const updated = await this.adminService.updateProduct(
      id,
      updateProductDto,
      files,
    );
    if (!updated) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product updated', product: updated };
  }

  @UseGuards(AdminGuard)
  @Get('orders/:id')
  async getOrderDetails(@Param('id', ParseIntPipe) id: number) {
    const order = await this.adminService.getOrderDetails(id);
    if (!order) throw new NotFoundException('Order not found');
    return { data: order };
  }

  @UseGuards(AdminGuard)
  @Get('customers/:id/activity')
  async getCustomerActivity(@Param('id', ParseIntPipe) id: number) {
    const activity = await this.adminService.getCustomerActivity(id);
    if (!activity) throw new NotFoundException('Customer not found');
    return { data: activity };
  }

  @UseGuards(AdminGuard)
  @Patch('customers/:id/freeze')
  async freezeUser(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.freezeUser(id);
    return { success: true };
  }

  @UseGuards(AdminGuard)
  @Patch('customers/:id/unfreeze')
  async unFreezeUser(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.unFreezeUser(id);
    return { success: true };
  }

  /**
   * GET /api/admin/profile
   * Get current admin's profile
   */
  @UseGuards(AdminGuard)
  @Get('profile')
  async getProfile(@User('id') adminId: string) {
    const profile = await this.adminService.getProfile(adminId);

    if (!profile) {
      throw new NotFoundException('Admin not found');
    }

    return { data: profile };
  }

  /**
   * PATCH /api/admin/profile
   * Update current admin's profile
   */
  @UseGuards(AdminGuard)
  @Patch('profile')
  async updateProfile(
    @User('id') adminId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const updatedProfile = await this.adminService.updateProfile(
        adminId,
        updateProfileDto,
      );

      return {
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to update profile');
    }
  }

  /**
   * POST /api/admin/change-password
   * Change admin's password
   */
  @UseGuards(AdminGuard)
  @Post('change-password')
  async changePassword(
    @User('id') adminId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      await this.adminService.changePassword(adminId, changePasswordDto);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }

  /**
   * GET /api/admin/notifications/preferences
   * Get admin's notification preferences
   */
  @UseGuards(AdminGuard)
  @Get('notifications/preferences')
  async getNotificationPreferences(@User('id') adminId: string) {
    try {
      const preferences =
        await this.adminService.getNotificationPreferences(adminId);

      return {
        success: true,
        data: preferences,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch notification preferences');
    }
  }

  /**
   * PATCH /api/admin/notifications/preferences
   * Update admin's notification preferences
   */
  @UseGuards(AdminGuard)
  @Patch('notifications/preferences')
  async updateNotificationPreferences(
    @User('id') adminId: string,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    try {
      const preferences = await this.adminService.updateNotificationPreferences(
        adminId,
        dto,
      );

      return {
        success: true,
        message: 'Notification preferences updated successfully',
        data: preferences,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update notification preferences',
      );
    }
  }

  /**
   * POST /api/admin/profile/avatar
   * Upload or update admin avatar
   */
  @UseGuards(AdminGuard)
  @Post('profile/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadAvatar(
    @User('id') adminId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const updated = await this.adminService.uploadAvatar(adminId, file);
      return {
        success: true,
        message: 'Avatar uploaded successfully',
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload avatar');
    }
  }

  /**
   * DELETE /api/admin/profile/avatar
   * Delete admin avatar
   */
  @UseGuards(AdminGuard)
  @Delete('profile/avatar')
  async deleteAvatar(@User('id') adminId: string) {
    try {
      const updated = await this.adminService.deleteAvatar(adminId);
      return {
        success: true,
        message: 'Avatar deleted successfully',
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete avatar');
    }
  }
}
