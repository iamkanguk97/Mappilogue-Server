import { InternalServerExceptionCode } from './../common/exception-code/internal-server.exception-code';
import { ExceptionResponseDto } from 'src/common/dtos/exception-response.dto';

export class ExceptionResponseHelper {
  /**
   * @summary 예외 Response 뼈대 만들어주는 함수
   * @author  Jason
   * @param   { number } statusCode
   * @param   { string } path
   * @returns { ExceptionResponseDto }
   */
  generateBasicExceptionResponse(
    statusCode: number,
    path: string,
  ): ExceptionResponseDto {
    return ExceptionResponseDto.from(statusCode, path);
  }

  /**
   * @summary NotFoundException Property를 ExceptionResponseDto에 적용시켜주는 함수
   * @author  Jason
   * @param   { ExceptionResponseDto } exceptionResponse
   */
  // setNotFoundException(exceptionResponse: ExceptionResponseDto): void {
  //   exceptionResponse.errorCode = NotFoundExceptionCode.code;
  //   exceptionResponse.message = NotFoundExceptionCode.message;
  // }

  /**
   * @summary BadRequestException Property를 ExceptionResponseDto에 적용시켜주는 함수
   * @author  Jason
   * @param   { ExceptionResponseDto } exceptionResponse
   * @param   { string } errorCode
   * @param   { string } message
   * @param   { string | undefined } target
   */
  setBadRequestException(
    exceptionResponse: ExceptionResponseDto,
    errorCode: string,
    message: string,
    target?: string | undefined,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
    exceptionResponse.target = target ?? '';
  }

  /**
   * @summary InternalServerException - NodeJS 레벨의 Property를 ExceptionResponseDto에 적용하는 함수
   * @author  Jason
   * @param   { ExceptionResponseDto } exceptionResponse
   * @param   { string | undefined } errorStack
   */
  setNodeInternalServerException(
    exceptionResponse: ExceptionResponseDto,
    errorStack?: string | undefined,
  ): void {
    exceptionResponse.errorCode =
      InternalServerExceptionCode.InternalServerError.code;
    exceptionResponse.message =
      InternalServerExceptionCode.InternalServerError.message;
    exceptionResponse.errorStack = errorStack ?? '';
  }

  /**
   * @summary InternalServerException Property를 ExceptionResponseDto에 적용하는 함수
   * @author  Jason
   *
   * @param   { ExceptionResponseDto } exceptionResponse
   * @param   { string } errorCode
   * @param   { string } message
   * @param   { string | undefined } errorStack
   */
  setInternalServerException(
    exceptionResponse: ExceptionResponseDto,
    errorCode: string,
    message: string,
    errorStack?: string | undefined,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
    exceptionResponse.errorStack = errorStack ?? '';
  }

  /**
   * @summary errorCode와 message setting 함수
   * @author  Jason
   * @param   { ExceptionResponseDto } exceptionResponse
   * @param   { string } errorCode
   * @param   { string } message
   */
  setBasicException(
    exceptionResponse: ExceptionResponseDto,
    errorCode: string,
    message: string,
  ): void {
    exceptionResponse.errorCode = errorCode;
    exceptionResponse.message = message;
  }
}
