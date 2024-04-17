import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export const TOKEN_BLACK_LIST_KEY = 'BLACKLIST';

@Injectable()
export class CustomCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getValue<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value, { ttl: 0 });
  }

  async delValue(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async setValueWithTTL<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, { ttl });
  }

  async setBlackList(key: string, ttl: number): Promise<void> {
    await this.cacheManager.set(key, TOKEN_BLACK_LIST_KEY, { ttl });
  }
}
