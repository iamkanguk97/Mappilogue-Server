export interface ExceptionCodeType {
  code: string;
  message: string;
}

export interface ExceptionJson {
  isSuccess: boolean;
  statusCode: number;
  errorCode: string;
  target?: string | undefined;
  message?: string | undefined;
  errorStack?: string | undefined;
  timestamp: string;
  path: string;
}
