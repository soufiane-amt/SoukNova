import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/createUser.dto';

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
  };

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
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
    it('Check if hashPassword method hashs the password.', async () => {
      const password = "é'(-'èè-(éàç_è-('rezlkzjkj435435435";
      const hashedPassword = await userService.hashPassword(password);
      const isEqual = await bcrypt.compare(password, hashedPassword);
      expect(isEqual).toBe(true);
    });
  });

  describe('comparePasswords', () => {
    it('Check if comparePasswords method returns true.', async () => {
      const saltRounds = 10;

      const password = "é'(-'èè-(éàç_è-('rezlkzjkj435435435";
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const isEqual = await userService.comparePasswords(
        password,
        hashedPassword,
      );
      expect(isEqual).toBe(true);
    });
    it('Check if comparePasswords method returns false.', async () => {
      const saltRounds = 10;
      const password = "é'(-'èè-(éàç_è-('rezlkzjkj435435435";
      const wrongPassword = "é'(-'èè-(éàç_è-('rezlkzjkj4354354ee35";
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const isEqual = await userService.comparePasswords(
        wrongPassword,
        hashedPassword,
      );
      expect(isEqual).toBe(false);
    });
  });

  describe('checkIfExists', () => {
    it('should return user if it exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      const result = await userService.checkIfExists({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await userService.checkIfExists({
        email: 'nonexistent@example.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should hash password and create a new user', async () => {
      const password = "é'(-'èè-(éàç_è-('rezlkzjkj435435435";

      const dto: CreateUserDto = {
        username: 'username',
        name: 'user name',
        email: 'username@gmail.com',
        password: password,
      };

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      jest.spyOn(userService, 'hashPassword').mockResolvedValue(hashedPassword);
      const createdUser: User = {
        id: 1,
        username: dto.username,
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        createdAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);
      const user = await userService.createUser(dto);
      expect(user).toEqual(createdUser);
    });
  });

  describe('checkIfCredentialsAreValid', () => {
    it('should return user for valid credentials', async () => {
      const user = {
        ...mockUser,
        password: await bcrypt.hash('correctpass', 10),
        name: null,
        createdAt: new Date(),
      };
      jest.spyOn(userService, 'checkIfExists').mockResolvedValue(user);
      jest.spyOn(userService, 'comparePasswords').mockResolvedValue(true);

      const result = await userService.checkIfCredentialsAreValid({
        email: user.email,
        password: 'correctpass',
      });
      expect(result).toEqual(user);
    });

    it('should return null for invalid password', async () => {
      const user = {
        ...mockUser,
        password: await bcrypt.hash('correctpass', 10),
        name: null,
        createdAt: new Date(),
      };
      jest.spyOn(userService, 'checkIfExists').mockResolvedValue(user);
      jest.spyOn(userService, 'comparePasswords').mockResolvedValue(false);

      const result = await userService.checkIfCredentialsAreValid({
        username: mockUser.username,
        password: 'wrongpass',
      });
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userService, 'checkIfExists').mockResolvedValue(null);

      const result = await userService.checkIfCredentialsAreValid({
        username: 'notfound',
        password: 'any',
      });
      expect(result).toBeNull();
    });
  });
});
