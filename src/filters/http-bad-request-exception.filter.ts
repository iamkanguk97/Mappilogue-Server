import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { isEmptyArray } from 'src/helpers/common.helper';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';

@Catch(BadRequestException)
export class HttpBadRequestExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const statusCode = HttpStatus.BAD_REQUEST;

    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );

    if (exceptionResponse instanceof ValidationError) {
      const validationResult = this.getExceptionObj(exceptionResponse);
      this.setBadRequestException(
        exceptionJson,
        validationResult.code,
        validationResult.message,
        validationResult.target,
      );
    } else {
      this.setBadRequestException(
        exceptionJson,
        exceptionResponse['code'],
        exceptionResponse['message'],
      );
    }

    response.status(statusCode).json(exceptionJson);
  }

  getExceptionObj(validationError: ValidationError) {
    const errorChildren = validationError.children;
    if (isEmptyArray(errorChildren)) {
      const target = validationError.property;
      const errorContext = validationError.contexts;
      const key = errorContext ? Object.keys(errorContext)[0] : undefined;
      return { ...errorContext?.[key], target };
    }
    return this.getExceptionInChildren(errorChildren);
  }

  getExceptionInChildren(errorChildren: ValidationError[]) {
    const firstChildren = errorChildren[0];
    const target = firstChildren.property;

    if (firstChildren.contexts) {
      const firstContexts = firstChildren.contexts;
      const key = Object.keys(firstContexts)[0];
      const errorValue = firstContexts[key];
      return { ...errorValue, target };
    } else {
      return !firstChildren.children.length
        ? { ...InternalServerExceptionCode.ContextNotSetting, target }
        : this.getExceptionInChildren(firstChildren.children);
    }
  }
}
