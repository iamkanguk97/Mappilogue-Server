import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getKoreaTime } from 'src/helpers/date.helper';

@Catch(HttpException)
export class HttpOtherExceptionFilter
  implements ExceptionFilter<HttpException>
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      isSuccess: false,
      errorCode: exceptionResponse['code'],
      statusCode,
      target: '',
      message: exceptionResponse['message'],
      timestamp: getKoreaTime(),
      path: request.url,
    });
  }
}
