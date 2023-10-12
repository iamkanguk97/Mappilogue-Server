import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CustomConfigService } from '../../custom-config/services';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly customConfigService: CustomConfigService,
  ) {}

  async getValue(key: string) {
    return this.cacheManager.get<string>(key);
  }
}
