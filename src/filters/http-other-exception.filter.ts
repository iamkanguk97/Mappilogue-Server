import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';

@Catch(HttpException)
export class HttpOtherExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<HttpException>
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );
    this.setBasicException(
      exceptionJson,
      exceptionResponse['code'],
      exceptionResponse['message'],
    );

    response.status(statusCode).json(exceptionJson);
  }
}
