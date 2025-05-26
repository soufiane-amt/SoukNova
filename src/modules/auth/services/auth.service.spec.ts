/* eslint-disable @typescript-eslint/unbound-method */
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    userService = {
      checkIfExists: jest.fn(),
      createUser: jest.fn(),
      checkIfCredentialsAreValid: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    authService = new AuthService(userService, jwtService, configService);
  });

  describe('getSecret', () => {
    it('should return JWT secret from config', () => {
      configService.get.mockReturnValue('supersecret');
      expect(authService.getSecret()).toBe('supersecret');
    });
  });

  describe('signUp', () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    } as unknown as CreateUserDto;

    it('should create user and return token', async () => {
      userService.checkIfExists.mockResolvedValue(null); // User does not exist
      userService.createUser.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: null,
        password: 'hashed-password',
        createdAt: new Date(),
      });
      jwtService.signAsync.mockResolvedValue('signed-token');

      const result = await authService.signUp(dto);

      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        username: 'testuser',
      });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('signIn', () => {
    const credentials: UserCredentialsDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      userService.checkIfCredentialsAreValid.mockResolvedValue(null);

      await expect(authService.signIn(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access token if credentials are valid', async () => {
      userService.checkIfCredentialsAreValid.mockResolvedValue({
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashed-password',
        createdAt: new Date(),
      });
      jwtService.signAsync.mockResolvedValue('signed-token');

      const result = await authService.signIn(credentials);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        username: 'john_doe',
      });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });
});
