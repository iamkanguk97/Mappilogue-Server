import { config } from 'dotenv';
import { CustomConfigService } from '../custom-config/services';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './services';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const customConfigService = new CustomConfigService(new ConfigService());
const databaseService = new DatabaseService(customConfigService);

export default new DataSource(
  databaseService.createTypeOrmOptions() as DataSourceOptions,
);
