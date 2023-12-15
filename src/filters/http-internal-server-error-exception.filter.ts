import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ExceptionCodeDto } from 'src/common/dtos/exception-code.dto';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';
import { CustomConfigService } from 'src/modules/core/custom-config/services';

type TInternalServerErrorException = ExceptionCodeDto & {
  err: { name: string; stack: string };
};

/**
 * @summary 500 InternalServerErrorException Filter
 * @author  Jason
 */
@Catch(InternalServerErrorException)
export class HttpInternalServerErrorExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<InternalServerErrorException>
{
  private readonly logger = new Logger(
    HttpInternalServerErrorExceptionFilter.name,
  );
  private readonly customConfigService = new CustomConfigService(
    new ConfigService(),
  );

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const exceptionResponse =
      exception.getResponse() as TInternalServerErrorException;
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof InternalServerErrorException) {
      const exceptionJson = this.generateBasicExceptionResponse(
        statusCode,
        request.url,
      );

      this.setInternalServerException(
        exceptionJson,
        exceptionResponse.code,
        exceptionResponse.message,
        this.customConfigService.isProduction() === true
          ? ''
          : exceptionResponse.err?.stack, // production일 때는 errorStack을 보여주지 않음.
      );
      this.logger.error(
        `[HttpBadRequestExceptionFilter - ${statusCode}] ${exceptionJson.errorCode}:${exceptionJson.message}`,
      );
      response.status(statusCode).json(exceptionJson);
    }
  }
}
