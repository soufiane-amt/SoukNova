import { Body, ConflictException, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dto/createUser.dto';
import { UserCredentialsDto } from '../../users/dto/userCredentials.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.signUp(user);
      res.cookie('jwt', token.access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
      });
      return { message: 'Login successful' };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException(
          'This account already existing, please sign in instead!',
        );
      }
      throw e;
    }
  }

  @Post('signin')
  async signIn(@Body() user: UserCredentialsDto) {
    return await this.authService.signIn(user);
  }
}
