import { IsOptional, IsBoolean } from 'class-validator';

export class GetNotificationsDto {
  @IsOptional()
  @IsBoolean()
  unreadOnly?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}