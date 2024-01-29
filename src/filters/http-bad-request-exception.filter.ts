import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { isEmptyArray } from 'src/helpers/common.helper';
import { ExceptionResponseHelper } from 'src/helpers/exception-response.helper';
import { ExceptionResponseDto } from 'src/common/dtos/exception-response.dto';
import { ExceptionCodeDto } from 'src/common/dtos/exception-code.dto';

type TExceptionResponse = ExceptionCodeDto | ValidationError;
type TBadRequestException = ExceptionCodeDto & { target?: string | undefined };
type TValidationErrorContext = { [errorKey: string]: ExceptionCodeDto };

/**
 * @summary 400번 Bad Request Exception Filter
 * @author  Jason
 */
@Catch(BadRequestException)
export class HttpBadRequestExceptionFilter
  extends ExceptionResponseHelper
  implements ExceptionFilter<BadRequestException>
{
  private readonly logger = new Logger(HttpBadRequestExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;
    const exceptionResponse = exception.getResponse() as TExceptionResponse;

    const exceptionJson = this.generateBasicExceptionResponse(
      statusCode,
      request.url,
    );

    this.decideBadRequestExceptionByInstance(exceptionJson, exceptionResponse);
    this.logger.error(
      `[HttpBadRequestExceptionFilter - ${statusCode}] ${exceptionJson.errorCode}:${exceptionJson.message}`,
    );
    response.status(statusCode).json(exceptionJson);
  }

  /**
   * @summary ValidationError OR ExceptionCodeDto인지 확인 후 예외 결정하는 함수
   * @author  Jason
   *
   * @param   { ExceptionResponseDto } exceptionJson
   * @param   { TExceptionResponse } exceptionResponse
   */
  decideBadRequestExceptionByInstance(
    exceptionJson: ExceptionResponseDto,
    exceptionResponse: TExceptionResponse,
  ): void {
    // Class-Validator를 통해 나온 에러 객체
    if (exceptionResponse instanceof ValidationError) {
      const validationResult = this.getExceptionObj(exceptionResponse); // 첫 에러 가져오기
      this.setBadRequestException(
        exceptionJson,
        validationResult.code,
        validationResult.message,
        validationResult.target,
      );
      return;
    }
    this.setBadRequestException(
      exceptionJson,
      exceptionResponse.code,
      exceptionResponse.message,
    );
  }

  /**
   * @summary Exception을 뱉어줄 메서드
   * @author  Jason
   * @param   { ValidationError } validationError
   * @returns { TBadRequestException }
   */
  getExceptionObj(validationError: ValidationError): TBadRequestException {
    const errorChildren = validationError.children ?? [];

    // Error Children이 없을 시 ==> 바로 반환해주면 됨
    if (isEmptyArray(errorChildren)) {
      const target = validationError.property;
      const errorContext = validationError.contexts as TValidationErrorContext;

      const key = errorContext ? Object.keys(errorContext)[0] : '';
      return {
        ...errorContext?.[key],
        target,
      } as TBadRequestException;
    }
    return this.getExceptionInChildren(errorChildren);
  }

  /**
   * @summary Children에서 Exception 추출해주는 함수
   * @author  Jason
   * @param   { ValidationError[] } errorChildren
   * @returns { TBadRequestException }
   */
  getExceptionInChildren(
    errorChildren: ValidationError[],
  ): TBadRequestException {
    const firstChildren = errorChildren[0];
    const target = firstChildren.property;

    if (firstChildren.contexts) {
      const firstContexts = firstChildren.contexts;
      const key = firstContexts ? Object.keys(firstContexts)[0] : '';
      const errorValue = firstContexts[key];
      return { ...errorValue, target } as TBadRequestException;
    }

    const secondChildren = firstChildren.children ?? [];
    return !secondChildren.length
      ? { ...InternalServerExceptionCode.ContextNotSetting, target }
      : this.getExceptionInChildren(secondChildren);
  }
}
