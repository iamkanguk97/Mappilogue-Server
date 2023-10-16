import { CustomConfigModule } from './../custom-config/custom-config.module';
import { Module } from '@nestjs/common';
import { DatabaseService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      useClass: DatabaseService,
    }),
    CustomConfigModule,
  ],
  providers: [DatabaseService],
  exports: [],
})
export class DatabaseModule {}
