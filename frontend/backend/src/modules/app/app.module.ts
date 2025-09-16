import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WishlistModule } from '../whishlist/wishlist.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    WishlistModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
