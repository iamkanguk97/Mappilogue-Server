import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiNotFoundExceptionCode } from 'src/common/exception-code/api-not-found.exception-code';
import { getKoreaTime } from 'src/helpers/date.helper';

@Catch(NotFoundException)
export class HttpNotFoundExceptionFilter
  implements ExceptionFilter<NotFoundException>
{
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof NotFoundException) {
      const statusCode = exception.getStatus();
      response.status(statusCode).json({
        isSuccess: false,
        errorCode: ApiNotFoundExceptionCode.code,
        statusCode,
        message: ApiNotFoundExceptionCode.message,
        timestamp: getKoreaTime(),
        path: request.url,
      });
    }
  }
}
