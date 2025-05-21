import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { UserCredentialsDto } from '../dto/userCredentials.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async checkIfExists(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
  }

  async checkIfCredentialsAreValid(
    userCredentials: UserCredentialsDto,
  ): Promise<boolean> {
    const whereClause: Prisma.UserWhereUniqueInput = userCredentials.username
      ? { username: userCredentials.username }
      : { email: userCredentials.email };

    const user = await this.checkIfExists(whereClause);
    if (user?.password == userCredentials.password) return true;
    return false;
  }
}
