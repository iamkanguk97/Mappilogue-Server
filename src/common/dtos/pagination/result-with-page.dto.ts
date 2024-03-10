import { Exclude, Expose } from 'class-transformer';
import { PageMetaDto } from './page-meta.dto';

export class ResultWithPageDto<T> {
  @Exclude() private readonly _data: T;
  @Exclude() private readonly _meta: PageMetaDto;

  private constructor(data: T, meta: PageMetaDto) {
    this._data = data;
    this._meta = meta;
  }

  static from<T>(data: T, meta: PageMetaDto): ResultWithPageDto<T> {
    return new ResultWithPageDto<T>(data, meta);
  }

  @Expose()
  get data(): T {
    return this._data;
  }

  @Expose()
  get meta(): PageMetaDto {
    return this._meta;
  }
}
