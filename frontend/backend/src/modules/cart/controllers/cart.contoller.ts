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

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  addToCart(@User('id') userId: number, @Param('productId') productId: string) {
    return this.cartService.addToCart(userId, productId);
  }

  @Delete(':productId')
  decreaseFromCart(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.decreaseFromCart(userId, productId);
  }

  @Patch(':productId')
  updateQuantity(
    @User('id') userId: number,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(userId, productId, quantity);
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
    console.log('-------------Dazz------');
    const data = await this.cartService.getCartItemQuantity(userId, productId);
    console.log('Data : ', data);

    return data;
  }
}
