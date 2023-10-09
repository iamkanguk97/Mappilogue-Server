import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { CustomConfigService } from './modules/core/custom-config/services';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ENVIRONMENT_KEY } from './modules/core/custom-config/constants/custom-config.constant';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const customConfigService = app.get<CustomConfigService>(CustomConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.use(helmet());

  app.disable('x-powered-by');

  const PORT = customConfigService.get<number>(ENVIRONMENT_KEY.PORT) || 3000;
  await app.listen(PORT);
  Logger.log(`🐥 Server is Running on PORT ${PORT}! 🐥`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
