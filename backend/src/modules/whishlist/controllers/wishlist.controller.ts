import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/modules/users/user.decorator';
import { WishlistService } from '../services/wishlist.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  async addToWishlist(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Delete(':productId')
  async removeFromWishlist(
    @User('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get()
  async getWishlist(@User('id') userId: number) {
    return this.wishlistService.getWishlist(userId);
  }
}
