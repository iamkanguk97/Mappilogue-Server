import { AxiosRequestConfig } from 'axios';
import { ExceptionCodeType } from 'src/types/type';

/**
 * @title Create Header -> Bearer Token field function
 * @param bearerToken
 * @returns AxiosRequestConfig
 */
export function generateBearerHeader(bearerToken: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
}

/**
 * @title Class-Validator에서 context를 지정할 때 사용하는 함수
 * @param errorMessage
 * @returns
 */
export function setValidatorContext(errorMessage: ExceptionCodeType): {
  context: ExceptionCodeType;
} {
  return {
    context: {
      ...errorMessage,
    },
  };
}

/**
 * @title Exception Code 생성하는 함수
 * @param code
 * @param message
 * @returns
 */
export function setExceptionCode(
  code: string,
  message: string,
): ExceptionCodeType {
  return { code, message };
}
