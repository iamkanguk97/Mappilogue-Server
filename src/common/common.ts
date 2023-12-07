import { AxiosRequestConfig } from 'axios';
import { ExceptionCodeDto } from './dtos/exception-code.dto';

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
 * @summary Exception Code 생성하는 함수
 * @author  Jason
 * @param   { string } code
 * @param   { string } message
 * @returns { ExceptionCodeDto }
 */
export function setExceptionCode(
  code: string,
  message: string,
): ExceptionCodeDto {
  return ExceptionCodeDto.from(code, message);
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
