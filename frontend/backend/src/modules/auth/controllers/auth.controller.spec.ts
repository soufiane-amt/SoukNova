/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UserCredentialsDto } from 'src/modules/users/dto/userCredentials.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService: jest.Mocked<AuthService> = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    getSecret: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call authService.signUp and return token', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password123',
        name: 'John',
      };

      const expectedToken = { access_token: 'token' };
      authService.signUp.mockResolvedValue(expectedToken);

      const result = await authController.signUp(dto);
      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedToken);
    });

    it('should throw ConflictException if user already exists', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password123',
        name: 'John',
      };

      authService.signUp.mockRejectedValue(new ConflictException());

      await expect(authController.signUp(dto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.signUp).toHaveBeenCalledWith(dto);
    });

    it('should rethrow unexpected errors', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password123',
        name: 'John',
      };

      const unexpectedError = new Error('Something went wrong');
      authService.signUp.mockRejectedValue(unexpectedError);

      await expect(authController.signUp(dto)).rejects.toThrow(
        'Something went wrong',
      );
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn and return token', async () => {
      const credentials: UserCredentialsDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedToken = { access_token: 'token' };
      authService.signIn.mockResolvedValue(expectedToken);

      const result = await authController.signIn(credentials);
      expect(authService.signIn).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(expectedToken);
    });
  });
});
