import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CustomCacheService } from './services/custom-cache.service';
import { CustomConfigModule } from '../custom-config/custom-config.module';
import { CustomConfigService } from '../custom-config/services';
import { ENVIRONMENT_KEY } from '../custom-config/constants/custom-config.constant';
import { CustomCacheHelper } from './helpers';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (customConfigService: CustomConfigService) => ({
        store: redisStore,
        host: customConfigService.get<string>(ENVIRONMENT_KEY.REDIS_HOST),
        port: customConfigService.get<number>(ENVIRONMENT_KEY.REDIS_PORT),
        password: customConfigService.get<string>(
          ENVIRONMENT_KEY.REDIS_PASSWORD,
        ),
      }),
      isGlobal: true,
    }),
  ],
  providers: [CustomCacheService, CustomCacheHelper],
  exports: [CustomCacheService, CustomCacheHelper],
})
export class CustomCacheModule {}
