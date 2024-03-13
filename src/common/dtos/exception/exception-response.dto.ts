import { getKoreaTime } from 'src/helpers/date.helper';

export class ExceptionResponseDto {
  public readonly isSuccess: boolean;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly path: string;

  public target: string;
  public message: string;
  public errorCode: string;
  public errorStack: string;

  private constructor(statusCode: number, path: string) {
    this.isSuccess = false;
    this.statusCode = statusCode;
    this.errorCode = '';
    this.target = '';
    this.message = '';
    this.errorStack = '';
    this.timestamp = getKoreaTime();
    this.path = path;
  }

  static from(statusCode: number, path: string): ExceptionResponseDto {
    return new ExceptionResponseDto(statusCode, path);
  }
}
