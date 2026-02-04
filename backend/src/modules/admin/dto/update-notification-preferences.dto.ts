import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  notifyOrders?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyNewUsers?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyReviews?: boolean;
}