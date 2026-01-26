import { RedisService } from './redis.service';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
  const RedisMock = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }));
  return {
    __esModule: true,
    default: RedisMock,
    // Add this line to support named import
    Redis: RedisMock,
  };
});

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.REDIS_URL;
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_PASSWORD;

    service = new RedisService();
  });

  describe('createClientFromEnv (via behavior)', () => {
    it('should create client using REDIS_URL if provided', () => {
      process.env.REDIS_URL = 'redis://localhost:6380';

      service.getClient();

      expect(Redis).toHaveBeenCalledWith('redis://localhost:6380');
    });

    it('should create client using host/port/password when REDIS_URL is missing', () => {
      process.env.REDIS_HOST = 'redis-host';
      process.env.REDIS_PORT = '6381';
      process.env.REDIS_PASSWORD = 'secret';

      service.getClient();

      expect(Redis).toHaveBeenCalledWith({
        host: 'redis-host',
        port: 6381,
        password: 'secret',
      });
    });

    it('should fallback to default host and port', () => {
      service.getClient();

      expect(Redis).toHaveBeenCalledWith({
        host: '127.0.0.1',
        port: 6379,
        password: undefined,
      });
    });
  });

  describe('getClient', () => {
    it('should lazily create redis client if not initialized', () => {
      const client = service.getClient();

      expect(client).toBeDefined();
      expect(Redis).toHaveBeenCalledTimes(1);
    });

    it('should return the same client instance on multiple calls', () => {
      const client1 = service.getClient();
      const client2 = service.getClient();

      expect(client1).toBe(client2);
      expect(Redis).toHaveBeenCalledTimes(1);
    });
  });
});
