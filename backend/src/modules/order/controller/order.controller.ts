import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/users/user.decorator';
import { OrderService } from '../services/order.service';
import { OrderDto } from '../dto/order.dto';

@UseGuards(AuthGuard)
@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async addOrder(@User('id') userId: number, @Body() orderData: OrderDto) {
    return await this.orderService.createOrder(userId, orderData);
  }

  @Get()
  async getOrders(
    @User('id') userId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.orderService.getOrders(userId, page, pageSize);
  }

  @Get(':id')
  async getOrder(@User('id') userId: number, @Param('id') orderId: string) {
    return this.orderService.getOrder(userId, orderId);
  }
}
