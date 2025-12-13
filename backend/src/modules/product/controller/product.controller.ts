import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductQueryDto } from '../dto/product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: ProductQueryDto) {
    return await this.productService.getProducts(query);
  }

  @Get('search')
  async searchProduct(@Query('query') query: string) {
    return this.productService.searchProduct(query);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId) {
    return this.productService.getProduct(productId);
  }
}
