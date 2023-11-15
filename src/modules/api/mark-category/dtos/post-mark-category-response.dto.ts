import { Exclude, Expose } from 'class-transformer';

export class PostMarkCategoryResponseDto {
  @Exclude() private readonly _markCategoryId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _sequence: number;

  private constructor(markCategoryId: number, title: string, sequence: number) {
    this._markCategoryId = markCategoryId;
    this._title = title;
    this._sequence = sequence;
  }

  static from(
    markCategoryId: number,
    title: string,
    sequence: number,
  ): PostMarkCategoryResponseDto {
    return new PostMarkCategoryResponseDto(markCategoryId, title, sequence);
  }

  @Expose()
  get markCategoryId(): number {
    return this._markCategoryId;
  }

  @Expose()
  get title(): string {
    return this._title;
  }

  @Expose()
  get sequence(): number {
    return this._sequence;
  }
}
