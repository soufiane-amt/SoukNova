import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductQueryDto } from '../dto/product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  async getProducts(@Query() query: ProductQueryDto) {
    if (!Object.keys(query).length) {
      return this.productService.getAllProducts();
    }
    return this.productService.getProducts(query);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId) {
    console.log('productId : ', productId);
    return this.productService.getProduct(productId);
  }
}
