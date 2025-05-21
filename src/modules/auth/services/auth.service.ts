import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.checkIfExists({
      email: createUserDto.email,
    });
    if (!user) {
      await this.userService.createUser(createUserDto);
    } else {
      throw new ConflictException('The user already exists!');
    }
  }

  async signIn(createUserDto: UserCredentialsDto) {
    const user =
      await this.userService.checkIfCredentialsAreValid(createUserDto);

    if (!user) throw new ConflictException("The user doesn't exists!");
    return {
      message: 'Credentials are successful, user authenticated',
      user: {
        username: createUserDto.username,
        email: createUserDto.email,
      },
    };
  }
}
