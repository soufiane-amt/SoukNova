import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
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
    // Ensure AdminService implements getProducts(page, limit, search)
    return this.adminService.getProducts(page, limit, search);
  }

  // GET /api/admin/dashboard
  @Get('dashboard')
  async getDashboard(
    @Query('recent', new DefaultValuePipe(5), ParseIntPipe) recent = 5,
  ) {
    return this.adminService.getDashboard(recent);
  }

  @Get('revenue')
  async getRevenueSeries(
  ) {
    return this.adminService.getRevenueSeries();
  }
}
