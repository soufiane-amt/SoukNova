import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    try {
      return await this.authService.signUp(user);
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException('User already exists');
      }
      throw e;
    }
  }

  @Post('signin')
  async signIn(@Body() user: UserCredentialsDto) {
    return await this.authService.signIn(user);
  }
}
