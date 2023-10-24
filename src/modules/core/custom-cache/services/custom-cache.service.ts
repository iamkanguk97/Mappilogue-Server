import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getValue<T>(key: string): Promise<T> {
    return await this.cacheManager.get<T>(key);
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async delValue(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async setValueWithTTL(
    key: string,
    value: string,
    ttl: number,
  ): Promise<void> {
    await this.cacheManager.set(key, value, { ttl });
  }
}
