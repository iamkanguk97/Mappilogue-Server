import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionCodeDto } from 'src/common/dtos/exception/exception-code.dto';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';

/**
 * @summary 위의 필터들에서 거쳐지지 않은 Exception을 다루는 Filter
 * @author  Jason
 */
@Catch(HttpException)
export class HttpOtherExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<HttpException>
{
  private readonly logger = new Logger(HttpOtherExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse() as ExceptionCodeDto;
    const { code, message } = exceptionResponse;

    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );

    this.setBasicException(exceptionJson, code, message);
    this.logger.error(
      `[HttpOtherExceptionFilter - ${statusCode}] ${code}:${message}`,
    );
    response.status(statusCode).json(exceptionJson);
  }
}
