import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _isSuccess: boolean;
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _result?: T | undefined;

  private constructor(
    isSuccess: boolean,
    statusCode: number,
    result?: T | undefined,
  ) {
    this._isSuccess = isSuccess;
    this._statusCode = statusCode;
    this._result = result;
  }

  static OK(statusCode: number): ResponseEntity<undefined> {
    return new ResponseEntity(true, statusCode);
  }

  static OK_WITH<T>(statusCode: number, result: T): ResponseEntity<T> {
    return new ResponseEntity<T>(true, statusCode, result);
  }

  @Expose()
  get isSuccess(): boolean {
    return this._isSuccess;
  }

  @Expose()
  get statusCode(): number {
    return this._statusCode;
  }

  @Expose()
  get result(): T | undefined {
    return this._result;
  }
}
