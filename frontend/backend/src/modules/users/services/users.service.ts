import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';
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

  async checkIfExists(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async checkIfCredentialsAreValid(
    userCredentials: UserCredentialsDto,
  ): Promise<User | null> {
    const whereClause: Prisma.UserWhereUniqueInput = userCredentials.username
      ? { username: userCredentials.username }
      : { email: userCredentials.email };

    const user = await this.checkIfExists(whereClause);
    if (
      user &&
      (await this.comparePasswords(userCredentials.password, user.password))
    )
      return user;
    return null;
  }
}
