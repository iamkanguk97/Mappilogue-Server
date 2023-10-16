import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { isEmptyArray } from 'src/helpers/common.helper';
import { getKoreaTime } from 'src/helpers/date.helper';

@Catch(BadRequestException)
export class HttpBadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    if (exceptionResponse instanceof ValidationError) {
      const result = this.getExceptionObj(exceptionResponse);
      response.status(statusCode).json({
        isSuccess: false,
        errorCode: result.code,
        statusCode,
        target: result.target,
        message: result.message,
        timestamp: getKoreaTime(),
        path: request.url,
      });
    } else {
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

    if (firstChildren.contexts) {
      const firstContexts = firstChildren.contexts;
      const fKey = Object.keys(firstContexts)[0];
      const fValue = firstContexts[fKey];
      return fValue;
    }
  }
}
