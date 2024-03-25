export class ExceptionCodeDto {
  readonly code: string;
  readonly message: string;
  readonly target?: string;

  constructor(code: string, message: string, target?: string) {
    this.code = code;
    this.message = message;
    this.target = target;
  }

  static from(
    code: string,
    message: string,
    target?: string,
  ): ExceptionCodeDto {
    return new ExceptionCodeDto(code, message, target);
  }
}
