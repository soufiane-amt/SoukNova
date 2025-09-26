import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/users/user.decorator';
import { orderDto } from '../dto/order.dto';
import { OrderService } from '../services/order.service';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async addOrder(@User('id') userId: number, @Body() orderData: orderDto) {
    return await this.orderService.createOrder(userId, orderData);
  }

  @Get()
  async getOrders(@User('id') userId: number) {
    return this.orderService.getOrders(userId);
  }

  @Get(':id')
  async getOrder(@User('id') userId: number, @Param('id') orderId: string) {
    return this.orderService.getOrder(userId, orderId);
  }
}
