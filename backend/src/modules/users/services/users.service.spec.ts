import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const result = await service.hashPassword('plain');
    expect(result).toBe('hashed');
    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
  });

  it('should compare passwords', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.comparePasswords('plain', 'hashed');
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
  });

  it('should check if user exists by email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const result = await service.checkIfExists('a@b.com');
    expect(result).toEqual({ id: 1, email: 'a@b.com' });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
    });
  });

  it('should create a user with hashed password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');
    prismaMock.user.create.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const dto = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'plain',
    };
    const result = await service.createUser(dto);
    expect(result).toEqual({ id: 1, email: 'a@b.com' });
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        password: 'hashedpass',
      },
    });
  });

  it('should update user data (name/email)', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      firstName: 'New',
      lastName: 'User',
      email: 'new@b.com',
    });
    const dto = { firstName: 'New', lastName: 'User', email: 'new@b.com' };
    const result = await service.updateUserData(1, dto);
    expect(result).toEqual({
      id: 1,
      firstName: 'New',
      lastName: 'User',
      email: 'new@b.com',
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { firstName: 'New', lastName: 'User', email: 'new@b.com' },
    });
  });

  it('should throw NotFoundException if user not found on update', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.updateUserData(1, {})).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update password if oldPassword is correct', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
    prismaMock.user.update.mockResolvedValue({ id: 1, password: 'newhashed' });
    const dto = { oldPassword: 'old', newPassword: 'new' };
    const result = await service.updateUserData(1, dto);
    expect(result).toEqual({ id: 1, password: 'newhashed' });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: 'newhashed' },
    });
  });

  it('should throw BadRequestException if newPassword but no oldPassword', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    await expect(
      service.updateUserData(1, { newPassword: 'new' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw UnauthorizedException if oldPassword is wrong', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(
      service.updateUserData(1, { oldPassword: 'wrong', newPassword: 'new' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should validate credentials and return user if valid', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.checkIfCredentialsAreValid({
      email: 'a@b.com',
      password: 'plain',
    });
    expect(result).toEqual({ id: 1, email: 'a@b.com', password: 'hashed' });
  });

  it('should return null if credentials are invalid', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.checkIfCredentialsAreValid({
      email: 'a@b.com',
      password: 'wrong',
    });
    expect(result).toBeNull();
  });

  it('should update user profile image', async () => {
    prismaMock.user.update.mockResolvedValue({ image: 'img.png' });
    const result = await service.updateUserProfileImage(1, 'img.png');
    expect(result).toEqual({ image: 'img.png' });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { image: 'img.png' },
      select: { image: true },
    });
  });

  it('should get user profile image', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      firstName: 'A',
      image: 'img.png',
    });
    const result = await service.getUserProfileImage(1);
    expect(result).toEqual({ firstName: 'A', imageUrl: 'img.png' });
  });

  it('should throw NotFoundException if user not found when getting profile image', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.getUserProfileImage(1)).rejects.toThrow(
      NotFoundException,
    );
  });
});
