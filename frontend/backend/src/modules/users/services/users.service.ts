import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from 'generated/prisma';
import { UserCredentialsDto } from '../dto/userCredentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  async checkIfExists(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.prisma.user.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async checkIfCredentialsAreValid(
    userCredentials: UserCredentialsDto,
  ): Promise<User | null> {
    const user = await this.checkIfExists(userCredentials.email);
    if (
      user &&
      (await this.comparePasswords(userCredentials.password, user.password))
    )
      return user;
    return null;
  }
}
