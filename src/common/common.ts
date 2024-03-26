import { AxiosRequestConfig } from 'axios';
import { ExceptionCodeDto } from './dtos/exception/exception-code.dto';
import { Request } from 'express';

/**
 * @summary Bearer Token Header 생성함수
 * @author  Jason
 * @param   { string } bearerToken
 * @returns { AxiosRequestConfig }
 */
export function generateBearerHeader(bearerToken: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
}

/**
 * @summary 헤더에서 JWT를 추출
 * @author  Jason
 * @param   { Request } request
 * @returns { string }
 */
export function extractTokenFromHeader(request: Request): string {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : '';
}

/**
 * @summary Exception Code 생성하는 함수
 * @author  Jason
 * @param   { string } code
 * @param   { string } message
 * @param   { string | undefined } target
 * @returns { ExceptionCodeDto }
 */
export function setExceptionCode(
  code: string,
  message: string,
  target?: string,
): ExceptionCodeDto {
  return ExceptionCodeDto.from(code, message, target);
}

/**
 * @summary Class-Validator에서 context를 지정할 때 사용하는 함수
 * @author  Jason
 * @param   { ExceptionCodeDto } errorMessage
 * @returns { { ExceptionCodeDto } context }
 */
export function setValidatorContext(errorMessage: ExceptionCodeDto): {
  context: ExceptionCodeDto;
} {
  return { context: errorMessage };
}
