export class ResponseEntity<T> {
  private readonly isSuccess: boolean;
  private readonly statusCode: number;
  private readonly result: T;

  private constructor(
    isSuccess: boolean,
    statusCode: number,
    result?: T | undefined,
  ) {
    this.isSuccess = isSuccess;
    this.statusCode = statusCode;
    this.result = result;
  }

  static OK(statusCode: number): ResponseEntity<undefined> {
    return new ResponseEntity(true, statusCode);
  }

  static OK_WITH<T>(statusCode: number, result: T): ResponseEntity<T> {
    return new ResponseEntity<T>(true, statusCode, result);
  }
}
