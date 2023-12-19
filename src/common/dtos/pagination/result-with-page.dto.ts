import { PageMetaDto } from './page-meta.dto';

export class ResultWithPageDto<T> {
  readonly result: T;
  readonly meta: PageMetaDto;

  constructor(result: T, meta: PageMetaDto) {
    this.result = result;
    this.meta = meta;
  }

  static from<T>(result: T, meta: PageMetaDto): ResultWithPageDto<T> {
    return new ResultWithPageDto<T>(result, meta);
  }
}
