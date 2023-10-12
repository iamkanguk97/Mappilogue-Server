import { DatabaseModule } from './database/database.module';
import { Global, Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { AuthModule } from './auth/auth.module';
import { CustomHttpModule } from './http/custom-http.module';
import { CustomCacheModule } from './custom-cache/custom-cache.module';

@Global()
@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    CustomHttpModule,
    CustomCacheModule,
  ],
  exports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    CustomHttpModule,
    CustomCacheModule,
  ],
})
export class CoreModule {}
