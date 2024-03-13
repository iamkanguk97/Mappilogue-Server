export class ExceptionCodeDto {
  readonly code: string;
  readonly message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  static from(code: string, message: string): ExceptionCodeDto {
    return new ExceptionCodeDto(code, message);
  }
}
