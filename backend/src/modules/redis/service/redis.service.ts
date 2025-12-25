import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis | null = null;

  onModuleInit() {
    this.client = this.createClientFromEnv();

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  private createClientFromEnv(): Redis {
    const url = process.env.REDIS_URL;
    if (url && url.trim().length > 0) {
      return new Redis(url);
    }

    return new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  getClient(): Redis {
    if (!this.client) {
      this.client = this.createClientFromEnv();
    }
    return this.client;
  }
}
