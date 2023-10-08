import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CUSTOM_CONFIG_VALIDATOR } from './validators';
import { CustomConfigService } from './services';

@Module({
  imports: [ConfigModule.forRoot(CUSTOM_CONFIG_VALIDATOR)],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
