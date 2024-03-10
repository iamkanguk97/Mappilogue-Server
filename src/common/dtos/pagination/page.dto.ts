import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  private readonly _data!: T[];
  private readonly _meta!: PageMetaDto;

  private constructor(data: T[], meta: PageMetaDto) {
    this._data = data;
    this._meta = meta;
  }

  static from<T>(data: T[], meta: PageMetaDto): PageDto<T> {
    return new PageDto(data, meta);
  }

  get data(): T[] {
    return this._data;
  }

  get meta(): PageMetaDto {
    return this._meta;
  }
}
