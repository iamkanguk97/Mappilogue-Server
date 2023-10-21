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
}
