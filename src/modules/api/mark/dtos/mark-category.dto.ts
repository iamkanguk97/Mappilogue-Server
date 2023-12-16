import { CheckColumnEnum } from 'src/constants/enum';
import { TMarkCategoryWithMarkCount } from '../types';
import { Exclude, Expose } from 'class-transformer';

export class MarkCategoryDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _sequence: number;
  @Exclude() private readonly _isMarkedInMap: CheckColumnEnum;
  @Exclude() private readonly _markCount?: number | undefined;

  constructor(
    id: number,
    title: string,
    sequence: number,
    isMarkedInMap: CheckColumnEnum,
    markCount?: number | undefined,
  ) {
    this._id = id;
    this._title = title;
    this._sequence = sequence;
    this._isMarkedInMap = isMarkedInMap;
    this._markCount = markCount;
  }

  static of(markCategory: TMarkCategoryWithMarkCount): MarkCategoryDto {
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
  get isMarkedInMap(): CheckColumnEnum {
    return this._isMarkedInMap;
  }

  @Expose()
  get markCount(): number {
    return this._markCount;
  }
}
