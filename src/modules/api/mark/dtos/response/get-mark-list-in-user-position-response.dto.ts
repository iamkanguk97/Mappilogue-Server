import { Exclude, Expose } from 'class-transformer';
import { IMarkListByCategory } from '../../interfaces';

export class GetMarkListInUserPositionResponseDto {
  @Exclude() private readonly _markList: IMarkListByCategory[];

  private constructor(markList: IMarkListByCategory[]) {
    this._markList = markList;
  }

  static of(
    markList: IMarkListByCategory[],
  ): GetMarkListInUserPositionResponseDto {
    return new GetMarkListInUserPositionResponseDto(markList);
  }

  @Expose()
  get markList(): IMarkListByCategory[] {
    return this._markList;
  }
}
