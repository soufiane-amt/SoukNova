import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { NotFoundException } from '@nestjs/common';

const TEST_PASSWORD = 'AbCd12!@';
const WRONG_PASSWORD = 'AbCd12!@Wrong';
const SALT_ROUNDS = 10;
describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;
  let hashedTestPassword: string;

  beforeAll(async () => {
    hashedTestPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
  });

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const buildUser = (overrides?: Partial<User>): User => ({
    id: 1,
    firstName: 'john',
    lastName: 'doe',
    email: 'test@example.com',
    password: overrides?.password ?? hashedTestPassword,
    createdAt: overrides?.createdAt ?? new Date(),
    image: overrides?.image ?? null,
    ...overrides,
  });

  const mockCheckIfExists = (user: User | null) => {
    jest.spyOn(userService, 'checkIfExists').mockResolvedValue(user);
  };
  const mockComparePasswords = (isEqual: boolean) => {
    jest.spyOn(userService, 'comparePasswords').mockResolvedValue(isEqual);
  };
  const mockHashPassword = (hashedPassword: string) => {
    jest.spyOn(userService, 'hashPassword').mockResolvedValue(hashedPassword);
  };
  const mockPrismaCreateUser = (user: User) => {
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('hashPassword', () => {
    it('returns true if the hashing function works.', async () => {
      const hashed = await userService.hashPassword(TEST_PASSWORD);
      expect(await bcrypt.compare(TEST_PASSWORD, hashed)).toBe(true);
    });
  });

  describe('comparePasswords', () => {
    it('returns true for matching passwords.', async () => {
      const isEqual = await userService.comparePasswords(
        TEST_PASSWORD,
        hashedTestPassword,
      );
      expect(isEqual).toBe(true);
    });

    it('returns false for non-matching passwords.', async () => {
      const isEqual = await userService.comparePasswords(
        WRONG_PASSWORD,
        hashedTestPassword,
      );
      expect(isEqual).toBe(false);
    });
  });

  describe('checkIfExists', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = buildUser();
    });

    it('should return user if it exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      const result = await userService.checkIfExists(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await userService.checkIfExists(mockUser.email);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should hash password and create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'john',
        lastName: 'doe',
        email: 'username@gmail.com',
        password: TEST_PASSWORD,
      };

      mockHashPassword(hashedTestPassword);
      const createdUser = buildUser({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: hashedTestPassword,
      });
      mockPrismaCreateUser(createdUser);
      const user = await userService.createUser(createUserDto);
      expect(user).toEqual(createdUser);
    });
  });

  describe('updateUserData', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = buildUser();
    });

    it('should throw an exception if the user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const updateUserDtoBasicMock: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        image: 'https://example.com/avatar.png',
      };

      return expect(
        userService.updateUserData(1, updateUserDtoBasicMock),
      ).rejects.toThrow(NotFoundException);
    });
    it("should throw an exception if the new password is sent without the old password't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const updateDto: UpdateUserDto = {
        newPassword: 'NewPassword1!',
      } as any;

      await expect(userService.updateUserData(1, updateDto)).rejects.toThrow(
        'Old password is required to change password',
      );
    });
    it("should throw an exception if provided old password and real user password don't match", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(userService, 'comparePasswords').mockResolvedValueOnce(false);

      const updateDto: UpdateUserDto = {
        oldPassword: 'wrongOld',
        newPassword: 'NewPassword1!',
      } as any;

      await expect(userService.updateUserData(1, updateDto)).rejects.toThrow(
        'Password is wrong',
      );
    });
    it('should hash new password and update user data when provided valid old password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(userService, 'comparePasswords').mockResolvedValueOnce(true);
      const hashedNew = await bcrypt.hash('NewPassword1!', SALT_ROUNDS);
      jest.spyOn(userService, 'hashPassword').mockResolvedValueOnce(hashedNew);

      const updatedUser = {
        ...mockUser,
        password: hashedNew,
        firstName: 'Updated',
      } as User;
      prismaMock.user.update.mockResolvedValueOnce(updatedUser);

      const updateDto: UpdateUserDto = {
        firstName: 'Updated',
        oldPassword: TEST_PASSWORD,
        newPassword: 'NewPassword1!',
      } as any;

      const result = await userService.updateUserData(1, updateDto);
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          password: hashedNew,
          firstName: 'Updated',
        }),
      });
    });
  });

  describe('profile image methods', () => {
    it('updateUserProfileImage should call prisma.update with image', async () => {
      prismaMock.user.update.mockResolvedValueOnce({ image: 'img.png' } as any);
      const res = await userService.updateUserProfileImage(1, 'img.png');
      expect(res).toEqual({ image: 'img.png' });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { image: 'img.png' },
        select: { image: true },
      });
    });

    it('getUserProfileImage should return image when user exists', async () => {
      const u = buildUser({ image: 'avatar.png' });
      prismaMock.user.findUnique.mockResolvedValueOnce(u);
      const res = await userService.getUserProfileImage(1);
      expect(res).toBe('avatar.png');
    });

    it('getUserProfileImage should throw when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      await expect(userService.getUserProfileImage(1)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('checkIfCredentialsAreValid', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = buildUser();
    });

    it('should return user for valid credentials', async () => {
      mockCheckIfExists(mockUser);
      mockComparePasswords(true);

      const result = await userService.checkIfCredentialsAreValid({
        email: mockUser.email,
        password: TEST_PASSWORD,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid password', async () => {
      mockCheckIfExists(mockUser);
      mockComparePasswords(false);

      const result = await userService.checkIfCredentialsAreValid({
        email: mockUser.email,
        password: WRONG_PASSWORD,
      });
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      mockCheckIfExists(null);

      const result = await userService.checkIfCredentialsAreValid({
        email: mockUser.email,
        password: TEST_PASSWORD,
      });
      expect(result).toBeNull();
    });
  });
});
