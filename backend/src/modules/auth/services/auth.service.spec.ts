import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const usersMock = {
    checkIfExists: jest.fn(),
    createUser: jest.fn(),
    checkIfCredentialsAreValid: jest.fn(),
  };

  const jwtMock = {
    signAsync: jest.fn().mockResolvedValue('signed-token'),
  };

  const configMock = {
    get: jest.fn().mockReturnValue('jwt-secret'),
  };

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) return usersMock;
        if (token === JwtService) return jwtMock;
        if (token === ConfigService) return configMock;
        if (token === PrismaService) return prismaMock;
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== getSecret Tests ====================
  describe('getSecret', () => {
    it('should return JWT secret from config', () => {
      configMock.get.mockReturnValueOnce('my-secret-key');

      const result = service.getSecret();

      expect(result).toBe('my-secret-key');
      expect(configMock.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should return undefined when JWT_SECRET is not configured', () => {
      configMock.get.mockReturnValueOnce(undefined);

      const result = service.getSecret();

      expect(result).toBeUndefined();
    });
  });

  // ==================== signUp Tests ====================
  describe('signUp', () => {
    const signUpDto = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create user and return access token with userId when user does not exist', async () => {
      const createdUser = { id: 1, email: signUpDto.email };
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce(createdUser);
      jwtMock.signAsync.mockResolvedValueOnce('new-user-token');

      const result = await service.signUp(signUpDto as any);

      expect(usersMock.checkIfExists).toHaveBeenCalledWith(signUpDto.email);
      expect(usersMock.createUser).toHaveBeenCalledWith(signUpDto);
      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: signUpDto.email,
      });
      expect(result).toEqual({
        userId: 1,
        access_token: 'new-user-token',
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      usersMock.checkIfExists.mockResolvedValueOnce({
        id: 1,
        email: signUpDto.email,
      });

      await expect(service.signUp(signUpDto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not call createUser when user already exists', async () => {
      usersMock.checkIfExists.mockResolvedValue({
        id: 1,
        email: signUpDto.email,
      });

      await expect(service.signUp(signUpDto as any)).rejects.toThrow();

      expect(usersMock.createUser).not.toHaveBeenCalled();
      expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });

    it('should handle user with numeric id correctly', async () => {
      const createdUser = { id: 42, email: 'test@example.com' };
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce(createdUser);
      jwtMock.signAsync.mockResolvedValueOnce('token-42');

      const result = await service.signUp({ email: 'test@example.com' } as any);

      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: 42,
        email: 'test@example.com',
      });
      expect(result).toEqual({
        userId: 42,
        access_token: 'token-42',
      });
    });

    it('should pass complete DTO to createUser', async () => {
      const fullDto = {
        email: 'complete@example.com',
        password: 'securePass123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
      };
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce({
        id: 1,
        email: fullDto.email,
      });
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signUp(fullDto as any);

      expect(usersMock.createUser).toHaveBeenCalledWith(fullDto);
    });
  });

  // ==================== signIn Tests ====================
  describe('signIn', () => {
    const signInDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    it('should return access token with userId for valid credentials', async () => {
      const validUser = { id: 5, email: signInDto.email };
      usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce(validUser);
      jwtMock.signAsync.mockResolvedValueOnce('valid-user-token');

      const result = await service.signIn(signInDto as any);

      expect(result).toEqual({
        userId: 5,
        access_token: 'valid-user-token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce(null);
      await expect(service.signIn({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should not generate token when credentials are invalid', async () => {
      usersMock.checkIfCredentialsAreValid.mockResolvedValue(null);

      await expect(service.signIn(signInDto as any)).rejects.toThrow();

      expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });

    it('should handle user with different id types', async () => {
      const user = { id: 999, email: 'bigid@example.com' };
      usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce(user);
      jwtMock.signAsync.mockResolvedValueOnce('token-999');

      const result = await service.signIn({
        email: 'bigid@example.com',
        password: 'pass',
      } as any);

      // JWT payload uses 'username' instead of 'email' for signIn
      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: 999,
        username: 'bigid@example.com',
      });
      expect(result).toEqual({
        userId: 999,
        access_token: 'token-999',
      });
    });

    it('should pass complete DTO to checkIfCredentialsAreValid', async () => {
      usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
      });
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signIn(signInDto as any);

      expect(usersMock.checkIfCredentialsAreValid).toHaveBeenCalledWith(
        signInDto,
      );
    });
  });

  // ==================== JWT Payload Tests ====================
  describe('JWT Payload Generation', () => {
    it('should generate correct payload structure for signUp', async () => {
      const user = { id: 10, email: 'payload@example.com' };
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce(user);
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signUp({ email: user.email } as any);

      // signUp uses 'email' in payload
      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: 10,
        email: 'payload@example.com',
      });
    });

    it('should generate correct payload structure for signIn', async () => {
      const user = { id: 20, email: 'signin@example.com' };
      usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce(user);
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signIn({ email: user.email, password: 'pass' } as any);

      // signIn uses 'username' in payload (different from signUp)
      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: 20,
        username: 'signin@example.com',
      });
    });
  });

  // ==================== Edge Cases ====================
  describe('Edge Cases', () => {
    it('should handle email with special characters', async () => {
      const email = 'user+test@sub.example.com';
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce({ id: 1, email });
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signUp({ email } as any);

      expect(usersMock.checkIfExists).toHaveBeenCalledWith(email);
    });

    it('should handle case-sensitive email check', async () => {
      const email = 'User@Example.COM';
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce({ id: 1, email });
      jwtMock.signAsync.mockResolvedValueOnce('token');

      await service.signUp({ email } as any);

      expect(usersMock.checkIfExists).toHaveBeenCalledWith(email);
    });

    it('should propagate errors from UsersService.createUser', async () => {
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.signUp({ email: 'test@test.com' } as any),
      ).rejects.toThrow('Database error');
    });

    it('should propagate errors from UsersService.checkIfCredentialsAreValid', async () => {
      usersMock.checkIfCredentialsAreValid.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(
        service.signIn({ email: 'test@test.com', password: 'pass' } as any),
      ).rejects.toThrow('Database error');
    });

    it('should propagate errors from JwtService.signAsync', async () => {
      usersMock.checkIfExists.mockResolvedValueOnce(null);
      usersMock.createUser.mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
      });
      jwtMock.signAsync.mockRejectedValueOnce(new Error('JWT signing failed'));

      await expect(
        service.signUp({ email: 'test@test.com' } as any),
      ).rejects.toThrow('JWT signing failed');
    });
  });
});
