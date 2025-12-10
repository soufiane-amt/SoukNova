import { IsNumber } from 'class-validator';

export class OrderDto {
  @IsNumber()
  orderTotal: number;
}
