import { Exclude, Expose } from 'class-transformer';
import { IMarkSearchByArea } from 'src/modules/api/schedule/types';
import { IMarkSearchByMark } from '../../interfaces';

type TMarkSearchResult = (IMarkSearchByMark | IMarkSearchByArea)[];

export class GetMarkSearchByOptionResponseDto {
  @Exclude() private readonly _markSearchResult!: TMarkSearchResult;

  private constructor(markSearchResult: TMarkSearchResult) {
    this._markSearchResult = markSearchResult;
  }

  static of(result: TMarkSearchResult): GetMarkSearchByOptionResponseDto {
    return new GetMarkSearchByOptionResponseDto(result);
  }

  @Expose()
  get markSearchResult(): TMarkSearchResult {
    return this._markSearchResult;
  }
}
