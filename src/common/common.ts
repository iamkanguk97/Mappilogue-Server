import { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { getKoreaTime } from 'src/helpers/date.helper';
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

export function setValidatorContext(errorMessage) {
  return {
    context: {
      ...errorMessage,
    },
  };
}

export function setExceptionCode(
  code: string,
  message: string,
): ExceptionCodeType {
  return { code, message };
}
