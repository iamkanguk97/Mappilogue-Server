import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InternalServerErrorException)
export class HttpInternalServerErrorExceptionFilter
  implements ExceptionFilter<InternalServerErrorException>
{
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
  }
}
