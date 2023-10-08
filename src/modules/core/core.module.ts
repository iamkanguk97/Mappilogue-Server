import { DatabaseModule } from './database/database.module';
import { Global, Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';

@Global()
@Module({
  imports: [CustomConfigModule, DatabaseModule],
  exports: [CustomConfigModule],
})
export class CoreModule {}
