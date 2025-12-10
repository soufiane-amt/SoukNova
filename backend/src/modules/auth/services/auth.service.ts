import {
  UnauthorizedException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';
import { UsersService } from '../../users/services/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.checkIfExists(createUserDto.email);
    if (!user) {
      const user = await this.userService.createUser(createUserDto);
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new ConflictException('The user already exists!');
    }
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ access_token: string }> {
    const user =
      await this.userService.checkIfCredentialsAreValid(userCredentialsDto);

    if (!user) throw new UnauthorizedException('Invalid credentials!');
    const payload = { sub: user?.id, username: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
