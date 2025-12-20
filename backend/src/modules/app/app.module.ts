import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WishlistModule } from '../whishlist/wishlist.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { CommentModule } from '../comment/comment.module';
import { ProductModule } from '../product/product.module';
import { ArticleModule } from '../article/article.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    WishlistModule,
    CartModule,
    OrderModule,
    CommentModule,
    ProductModule,
    ArticleModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
