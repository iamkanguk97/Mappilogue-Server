import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { getKoreaTime } from 'src/helpers/date.helper';
import { CustomConfigService } from 'src/modules/core/custom-config/services';

/**
 * @description NodeJS 단계에서 발생하는 에러 Filter
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const customConfigService = new CustomConfigService(new ConfigService());

    response.status(statusCode).json({
      isSuccess: false,
      errorCode: '9999',
      statusCode,
      message: '서버 내부 에러',
      timestamp: getKoreaTime(),
      path: request.url,
      errorStack:
        customConfigService.isProduction() === true ? '' : exception.stack,
    });
  }
}
