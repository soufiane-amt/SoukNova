import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from 'src/modules/users/user.decorator';

@Controller('api/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  addToCart(@User('id') userId: number, @Param('productId') productId: string) {
    return this.cartService.addToCart(userId, productId);
  }

  @Patch(':productId')
  decreaseFromCart(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.decreaseFromCart(userId, productId);
  }

  @Delete('/reset')
  async deleteCarts(@User('id') userId: number) {
    return this.cartService.deleteCarts(userId);
  }

  @Delete(':productId')
  updateQuantity(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Get()
  getCart(@User('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Get(':productId')
  async getCartItemQuantity(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    const data = await this.cartService.getCartItemQuantity(userId, productId);
    return data;
  }
}
