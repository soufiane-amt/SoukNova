import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from 'generated/prisma';
import { UserCredentialsDto } from '../dto/userCredentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/updateUser.dto';

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

  async updateUserData(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const { firstName, lastName, email, oldPassword, newPassword } =
      updateUserDto;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (newPassword) {
      if (!oldPassword) {
        throw new Error('Old password is required to change password');
      }

      const isValid = await this.comparePasswords(oldPassword, user.password);

      if (!isValid) {
        throw new Error('Password is wrong');
      }

      updateData.password = await this.hashPassword(newPassword);
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
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

  async updateUserProfileImage(userId: number, image: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { image: image },
    });
  }

  async getUserProfileImage(userId: number): Promise<string | null> {
    console.log('------2---------');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('------3---------user : ', user);

    if (!user) {
      throw new Error('User not found');
    }
    console.log('------4---------');

    return user.image;
  }
}
