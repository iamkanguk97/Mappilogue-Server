import { Injectable } from '@nestjs/common';
import { ENVIRONMENT_KEY } from '../constants/custom-config.constant';
import { ConfigEnvironment } from '../constants/custom-config.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(
    private readonly configService: ConfigService<typeof ENVIRONMENT_KEY, true>,
  ) {}

  get<T>(key: (typeof ENVIRONMENT_KEY)[keyof typeof ENVIRONMENT_KEY]): T {
    return this.configService.get<T>(key);
  }

  isLocal(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === ConfigEnvironment.LOCAL
    );
  }

  isDevelopment(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      ConfigEnvironment.DEVELOPMENT
    );
  }

  isProduction(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      ConfigEnvironment.PRODUCTION
    );
  }
}
