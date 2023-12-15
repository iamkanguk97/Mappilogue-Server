import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';
import { CustomConfigService } from 'src/modules/core/custom-config/services';

/**
 * @summary NodeJS 단계에서 발생하는 에러 Filter
 * @author  Jason
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter
{
  private readonly logger = new Logger(
    HttpNodeInternalServerErrorExceptionFilter.name,
  );
  private readonly customConfigService = new CustomConfigService(
    new ConfigService(),
  );

  catch(exception: { name: string; stack: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );

    this.setNodeInternalServerException(
      exceptionJson,
      this.customConfigService.isProduction() === true ? '' : exception.stack, // Production일 때는 ErrorStack이 보이지 않도록 함.
    );
    this.logger.error(
      `[HttpNodeInternalServerErrorExceptionFilter - ${statusCode}] ${exceptionJson.errorCode}:${exceptionJson.message}`,
    );
    response.status(statusCode).json(exceptionJson);
  }
}
