import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    get: jest.fn().mockReturnValue('secret'),
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
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('getSecret should return value from config', () => {
    configMock.get.mockReturnValueOnce('secret');
    expect(service.getSecret()).toBe('secret');
  });

  it('signUp should create user and return token when user does not exist', async () => {
    const dto = { email: 'a@a.com' } as any;

    usersMock.checkIfExists.mockResolvedValueOnce(null);
    usersMock.createUser.mockResolvedValueOnce({ id: 1, email: 'a@a.com' });
    jwtMock.signAsync.mockResolvedValueOnce('jwt-token');

    const res = await service.signUp(dto);

    expect(usersMock.checkIfExists).toHaveBeenCalledWith('a@a.com');
    expect(usersMock.createUser).toHaveBeenCalledWith(dto);

    expect(jwtMock.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'a@a.com',
    });

    expect(res).toEqual({
      access_token: 'jwt-token',
    });
  });

  it('signUp should throw ConflictException when user exists', async () => {
    usersMock.checkIfExists.mockResolvedValueOnce({ id: 1, email: 'a@a.com' });
    await expect(service.signUp({} as any)).rejects.toThrow(ConflictException);
  });

  it('signIn should return token for valid credentials', async () => {
    const dto = { email: 'a@a.com' } as any;
    usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce({
      id: 2,
      email: dto.email,
    });
    jwtMock.signAsync.mockResolvedValueOnce('signed-token');

    const res = await service.signIn(dto);
    expect(res).toEqual({ access_token: 'signed-token' });
  });

  it('signIn should throw UnauthorizedException for invalid credentials', async () => {
    usersMock.checkIfCredentialsAreValid.mockResolvedValueOnce(null);
    await expect(service.signIn({} as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
