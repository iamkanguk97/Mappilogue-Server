import { DatabaseModule } from './database/database.module';
import { Global, Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { AuthModule } from './auth/auth.module';
import { CustomHttpModule } from './http/custom-http.module';

@Global()
@Module({
  imports: [CustomConfigModule, DatabaseModule, AuthModule, CustomHttpModule],
  exports: [CustomConfigModule, DatabaseModule, AuthModule, CustomHttpModule],
})
export class CoreModule {}
