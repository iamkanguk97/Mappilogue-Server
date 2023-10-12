import { AxiosRequestConfig } from 'axios';

export const generateBearerHeader = (
  bearerToken: string,
): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
};

export function setValidatorContext(errorMessage) {
  return {
    context: {
      ...errorMessage,
    },
  };
}
