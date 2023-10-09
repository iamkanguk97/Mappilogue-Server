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
