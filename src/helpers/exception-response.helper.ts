import { InternalServerExceptionCode } from './../common/exception-code/internal-server.exception-code';
import { ExceptionJson } from 'src/types/type';
import { getKoreaTime } from './date.helper';
import { ApiNotFoundExceptionCode } from 'src/common/exception-code/api-not-found.exception-code';

export class ExceptionResponseHelper {
  generateBasicExceptionResponse(
    statusCode: number,
    path: string,
  ): ExceptionJson {
    return {
      isSuccess: false,
      statusCode,
      errorCode: '',
      target: '',
      message: '',
      errorStack: '',
      timestamp: getKoreaTime(),
      path,
    };
  }

  setNotFoundException(exceptionResponse: ExceptionJson): void {
    exceptionResponse.errorCode = ApiNotFoundExceptionCode.code;
    exceptionResponse.message = ApiNotFoundExceptionCode.message;
  }

  setBadRequestException(
    exceptionResponse: ExceptionJson,
    errorCode: string,
    message: string,
    target?: string | undefined,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
    exceptionResponse.target = target ?? '';
  }

  setNodeInternalServerException(
    exceptionResponse: ExceptionJson,
    errorStack?: string | undefined,
  ): void {
    exceptionResponse.errorCode =
      InternalServerExceptionCode.InternalServerError.code;
    exceptionResponse.message =
      InternalServerExceptionCode.InternalServerError.message;
    exceptionResponse.errorStack = errorStack ?? '';
  }

  setInternalServerException(
    exceptionResponse: ExceptionJson,
    errorCode: string,
    message: string,
    errorStack?: string | undefined,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
    exceptionResponse.errorStack = errorStack ?? '';
  }

  setBasicException(
    exceptionResponse: ExceptionJson,
    errorCode: string,
    message: string,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
  }
}
