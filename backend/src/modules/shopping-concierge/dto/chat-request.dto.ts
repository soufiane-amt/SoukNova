import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
