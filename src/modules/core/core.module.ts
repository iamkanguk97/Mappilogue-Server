import { DatabaseModule } from './database/database.module';
import { Global, Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { AuthModule } from './auth/auth.module';
import { CustomHttpModule } from './http/custom-http.module';
import { CustomCacheModule } from './custom-cache/custom-cache.module';
import { NotificationModule } from './notification/notification.module';
import { CronModule } from './cron/cron.module';

/**
 * @comment IF YOU ADD A NEW CORE MODULE, THEN IMPORT INTO THIS FILE!
 * @author  Jason
 */

@Global()
@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    CustomHttpModule,
    CustomCacheModule,
    NotificationModule,
    CronModule,
  ],
  exports: [
    CustomConfigModule,
    DatabaseModule,
    AuthModule,
    CustomHttpModule,
    CustomCacheModule,
    NotificationModule,
    CronModule,
  ],
})
export class CoreModule {}
