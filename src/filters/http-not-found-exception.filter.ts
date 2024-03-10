import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionCodeDto } from 'src/common/dtos/exception-code.dto';
import { NotFoundExceptionCode } from 'src/common/exception-code/api-not-found.exception-code';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';

/**
 * @summary 404 Not Found Exception Filter
 * @author  Jason
 */
@Catch(NotFoundException)
export class HttpNotFoundExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<NotFoundException>
{
  private readonly logger = new Logger(HttpNotFoundExceptionFilter.name);

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.NOT_FOUND;

    if (exception instanceof NotFoundException) {
      const exceptionResponse = exception.getResponse();
      const exceptionJson = this.generateBasicExceptionResponse(
        statusCode,
        request.url,
      );

      if (exceptionResponse instanceof ExceptionCodeDto) {
        exceptionJson.errorCode = exceptionResponse.code;
        exceptionJson.message = exceptionResponse.message;
      } else {
        exceptionJson.errorCode = NotFoundExceptionCode.ApiNotFoundError.code;
        exceptionJson.message = NotFoundExceptionCode.ApiNotFoundError.message;
      }

      this.logger.error(
        `[HttpNotFoundExceptionFilter - ${statusCode}] ${exceptionJson.errorCode}:${exceptionJson.message}`,
      );
      response.status(statusCode).json(exceptionJson);
    }
  }
}
