import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './services/product.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
