import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';

@Catch(NotFoundException)
export class HttpNotFoundExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<NotFoundException>
{
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.NOT_FOUND;

    if (exception instanceof NotFoundException) {
      const exceptionJson = this.generateBasicExceptionResponse(
        statusCode,
        request.url,
      );
      this.setNotFoundException(exceptionJson);

      response.status(statusCode).json(exceptionJson);
    }
  }
}
