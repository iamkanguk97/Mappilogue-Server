import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';
import { CustomConfigService } from 'src/modules/core/custom-config/services';

/**
 * @description NodeJS 단계에서 발생하는 에러 Filter
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const customConfigService = new CustomConfigService(new ConfigService());
    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );
    this.setNodeInternalServerException(
      exceptionJson,
      customConfigService.isProduction() === true ? '' : exception.stack,
    );

    response.status(statusCode).json(exceptionJson);
  }
}
