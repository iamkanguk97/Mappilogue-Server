import { Exclude, Expose } from 'class-transformer';
import {
  IMarkSearchByArea,
  IMarkSearchByMark,
} from 'src/modules/api/schedule/types';

export class GetMarkSearchByOptionResponseDto {
  @Exclude() private readonly _searchResult:
    | IMarkSearchByArea[]
    | IMarkSearchByMark[];

  private constructor(searchResult: IMarkSearchByArea[] | IMarkSearchByMark[]) {
    this._searchResult = searchResult;
  }

  static of(searchResult: IMarkSearchByArea[] | IMarkSearchByMark[]) {
    return new GetMarkSearchByOptionResponseDto(searchResult);
  }

  @Expose()
  get searchResult() {
    return this._searchResult;
  }
}
