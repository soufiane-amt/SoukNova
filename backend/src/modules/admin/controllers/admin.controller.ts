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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from '../services/admin.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Response } from 'express';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() adminCredentials: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.adminService.signIn(adminCredentials);
    console.log('---------------2---------------');

    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none',
    });
    console.log('---------------3---------------');
    console.log('-access_token----', access_token);

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
}
