import { Exclude, Expose } from 'class-transformer';
import { PageMetaDto } from '../dtos/pagination/page-meta.dto';

export class ResponseEntity<T> {
  @Exclude() private readonly _isSuccess: boolean;
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _result?: T | undefined;
  @Exclude() private readonly _meta?: PageMetaDto | undefined;

  private constructor(
    isSuccess: boolean,
    statusCode: number,
    result?: T | undefined,
    meta?: PageMetaDto | undefined,
  ) {
    this._isSuccess = isSuccess;
    this._statusCode = statusCode;
    this._result = result;
    this._meta = meta;
  }

  static OK(statusCode: number): ResponseEntity<undefined> {
    return new ResponseEntity(true, statusCode);
  }

  static OK_WITH<T>(statusCode: number, result: T): ResponseEntity<T> {
    return new ResponseEntity<T>(true, statusCode, result);
  }

  static OK_WITH_PAGINATION<T>(
    statusCode: number,
    result: T,
    meta: PageMetaDto,
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(true, statusCode, result, meta);
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

  @Expose()
  get meta(): PageMetaDto | undefined {
    return this._meta;
  }
}
