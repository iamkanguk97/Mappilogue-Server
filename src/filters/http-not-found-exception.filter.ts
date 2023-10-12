import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiNotFoundException } from 'src/common/error-code';
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
        errorCode: ApiNotFoundException.code,
        statusCode,
        message: ApiNotFoundException.message,
        timestamp: getKoreaTime(),
        path: request.url,
      });
    }
  }
}
