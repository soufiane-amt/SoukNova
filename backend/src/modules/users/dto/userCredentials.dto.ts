import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
