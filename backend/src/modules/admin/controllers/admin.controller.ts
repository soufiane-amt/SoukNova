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
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from '../services/admin.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateProductDto } from '../dto/create-product.dto';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('api/admin')
// @UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('customers')
  async getCustomers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getCustomers(page, limit, search);
  }

  @Get('orders')
  async getOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getOrders(page, limit, search);
  }

  @Get('products')
  async getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProducts(page, limit, search);
  }

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

  // GET /api/admin/dashboard
  @Get('dashboard')
  async getDashboard(
    @Query('recent', new DefaultValuePipe(5), ParseIntPipe) recent = 5,
  ) {
    return this.adminService.getDashboard(recent);
  }

  @Get('revenue')
  async getRevenueSeries() {
    return this.adminService.getRevenueSeries();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.adminService.deleteUserAndRelations(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { success: true, message: 'User and related data deleted' };
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    const deleted = await this.adminService.deleteProductAndRelations(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product and related data deleted' };
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.adminService.getProductById(id);
    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }

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
}
