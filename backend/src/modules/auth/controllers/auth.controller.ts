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
import { AuthOrAdminGuard } from '../guards/authoradmin.guard';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly notificationService: NotificationService) {}

  @UseGuards(AuthOrAdminGuard)
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
      const { access_token, userId } = await this.authService.signUp(user);
      res.cookie('jwt', access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 240,
        secure: true,
        sameSite: 'none',
      });
      this.authService.logSession(res.req, userId);
      this.notificationService.notifyNewUser({
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName});
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
    const { access_token, userId } = await this.authService.signIn(user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none',
    });
    this.authService.logSession(res.req, userId);
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
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Signed out successfully' };
  }
}
