import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dto/createUser.dto';
import { UserCredentialsDto } from '../../users/dto/userCredentials.dto';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken() {
    return { valid: true };
  }

  @Post('signup')
  async signUp(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.signUp(user);
      res.cookie('jwt', token.access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 240,
        sameSite: 'lax',
      });
      return { message: 'Signup is successful' };
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
  async signIn(
    @Body() user: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signIn(user);
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
    });
    return { message: 'Login successful' };
  }
  catch(e) {
    if (e instanceof ConflictException) {
      throw new ConflictException(
        'This account already existing, please sign in instead!',
      );
    }
    throw e;
  }

  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Signed out successfully' };
  }
}
