import { redisClient } from './connection';
import { ICacheService } from '../../../application/ports/ICacheService';

export class RedisService implements ICacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds
    });
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
