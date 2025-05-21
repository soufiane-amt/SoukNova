import {
  UnauthorizedException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.checkIfExists({
      email: createUserDto.email,
    });
    if (!user) {
      return await this.userService.createUser(createUserDto);
    } else {
      throw new ConflictException('The user already exists!');
    }
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ message: string; user: { username?: string; email?: string } }> {
    const user =
      await this.userService.checkIfCredentialsAreValid(userCredentialsDto);

    if (!user) throw new UnauthorizedException('Invalid credentials!');
    return {
      message: 'Credentials are successful, user authenticated',
      user: {
        username: userCredentialsDto.username,
        email: userCredentialsDto.email,
      },
    };
  }
}
