import { ECheckColumn } from 'src/constants/enum';
import { Exclude, Expose } from 'class-transformer';
import { IMarkCategoryWithMarkCount } from '../../interfaces';

export class MarkCategoryDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _sequence: number;
  @Exclude() private readonly _isMarkedInMap: ECheckColumn;
  @Exclude() private readonly _markCount?: number;

  private constructor(
    id: number,
    title: string,
    sequence: number,
    isMarkedInMap: ECheckColumn,
    markCount?: number,
  ) {
    this._id = id;
    this._title = title;
    this._sequence = sequence;
    this._isMarkedInMap = isMarkedInMap;
    this._markCount = markCount;
  }

  static of(markCategory: IMarkCategoryWithMarkCount): MarkCategoryDto {
    return new MarkCategoryDto(
      markCategory.id,
      markCategory.title,
      markCategory.sequence,
      markCategory.isMarkedInMap,
      Number(markCategory.markCount),
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get title(): string {
    return this._title;
  }

  @Expose()
  get sequence(): number {
    return this._sequence;
  }

  @Expose()
  get isMarkedInMap(): ECheckColumn {
    return this._isMarkedInMap;
  }

  @Expose()
  get markCount(): number | undefined {
    return this._markCount;
  }
}
