import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CustomConfigService } from '../../custom-config/services';
import { DATABASE_MODELS } from '../constants';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly customConfigService: CustomConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.customConfigService.get<string>('DATABASE_HOST'),
      port: this.customConfigService.get<number>('DATABASE_PORT'),
      username: this.customConfigService.get<string>('DATABASE_USERNAME'),
      password: this.customConfigService.get<string>('DATABASE_PASSWORD'),
      database: this.customConfigService.get<string>('DATABASE_NAME'),
      entities: DATABASE_MODELS,
      logging: true,
      synchronize: this.customConfigService.isLocal(),
      charset: 'utf8mb4',
      timezone: 'Asia/Seoul',
      migrationsTableName: 'migrations',
    };
  }
}
