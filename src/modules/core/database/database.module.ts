import { CustomConfigModule } from './../custom-config/custom-config.module';
import { Module } from '@nestjs/common';
import { DatabaseService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from '../custom-config/services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      useClass: DatabaseService,
    }),
  ],
  providers: [CustomConfigService, DatabaseService],
  exports: [],
})
export class DatabaseModule {}
