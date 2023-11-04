import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { CustomConfigService } from './modules/core/custom-config/services';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ENVIRONMENT_KEY } from './modules/core/custom-config/constants/custom-config.constant';
import { HttpBadRequestExceptionFilter } from './filters/http-bad-request-exception.filter';
import { HttpNotFoundExceptionFilter } from './filters/http-not-found-exception.filter';
import { ValidationError } from 'class-validator';
import { HttpOtherExceptionFilter } from './filters/http-other-exception.filter';
import { HttpInternalServerErrorExceptionFilter } from './filters/http-internal-server-error-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from './filters/http-node-internal-server-error-exception.filter';

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
      // whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new BadRequestException(validationErrors[0]);
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(
    new HttpNodeInternalServerErrorExceptionFilter(),
    new HttpOtherExceptionFilter(),
    new HttpInternalServerErrorExceptionFilter(),
    new HttpNotFoundExceptionFilter(),
    new HttpBadRequestExceptionFilter(),
  );

  app.use(helmet());

  app.disable('x-powered-by');

  const PORT = customConfigService.get<number>(ENVIRONMENT_KEY.PORT) || 3030;
  await app.listen(PORT);
  Logger.log(`🐥 Server is Running on PORT ${PORT}! 🐥`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
