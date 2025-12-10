import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'rate_asc',
      'rate_desc',
      'price_asc',
      'price_desc',
      'date_asc',
      'date_desc',
    ],
    {
      message: 'order must be one of priceAsc, priceDesc, rateAsc, rateDesc',
    },
  )
  order?: string;
}
