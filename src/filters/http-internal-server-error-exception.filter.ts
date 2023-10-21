import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';
import { CustomConfigService } from 'src/modules/core/custom-config/services';

@Catch(InternalServerErrorException)
export class HttpInternalServerErrorExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<InternalServerErrorException>
{
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const customConfigService = new CustomConfigService(new ConfigService());

    if (exception instanceof InternalServerErrorException) {
      const exceptionJson = this.generateBasicExceptionResponse(
        statusCode,
        request.url,
      );
      this.setInternalServerException(
        exceptionJson,
        exceptionResponse['code'],
        exceptionResponse['message'],
        customConfigService.isProduction() === true
          ? ''
          : exceptionResponse['err']?.stack,
      );

      response.status(statusCode).json(exceptionJson);
    }
  }
}
