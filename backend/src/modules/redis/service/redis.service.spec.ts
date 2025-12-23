/* eslint-disable @typescript-eslint/no-var-requires */
const onMock = jest.fn();
const mockClient = { on: onMock } as any;
const RedisConstructorMock = jest.fn().mockImplementation((opts) => mockClient);

jest.mock('ioredis', () => ({ Redis: RedisConstructorMock }));

import { RedisService } from './redis.service';

describe('RedisService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('getClient should be undefined before init', () => {
    const svc = new RedisService();
    expect(svc.getClient()).toBeUndefined();
  });

  it('onModuleInit should create a Redis client with env config and register error handler', () => {
    process.env.REDIS_HOST = 'redis-host';
    process.env.REDIS_PORT = '6379';
    process.env.REDIS_PASSWORD = 'secret';

    const svc = new RedisService();
    svc.onModuleInit();

    expect(RedisConstructorMock).toHaveBeenCalledWith({
      host: 'redis-host',
      port: 6379,
      password: 'secret',
    });

    expect(onMock).toHaveBeenCalledWith('error', expect.any(Function));
    expect(svc.getClient()).toBe(mockClient);
  });

  it('onModuleInit should still set client when some env vars are missing', () => {
    delete process.env.REDIS_PASSWORD;
    process.env.REDIS_HOST = 'h';
    process.env.REDIS_PORT = '1234';

    const svc = new RedisService();
    svc.onModuleInit();

    expect(RedisConstructorMock).toHaveBeenCalledWith({
      host: 'h',
      port: 1234,
      password: undefined,
    });
    expect(svc.getClient()).toBe(mockClient);
  });
});
