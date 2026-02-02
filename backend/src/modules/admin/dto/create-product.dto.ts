import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((s: string) => s.trim());
      }
    }
    return value;
  })
  categories: string[];

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsString()
  @IsEnum(['In Stock', 'Low Stock', 'Out of Stock'])
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  dimensions?: {
    length: string;
    width: string;
    height: string;
    unit: 'in' | 'cm' | 'mm';
  };
}
