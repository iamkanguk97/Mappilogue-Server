import { Exclude, Expose } from 'class-transformer';
import { IMarkListByCategory } from '../../interfaces';

export class GetMarkListByCategoryResponseDto {
  @Exclude() private readonly _markListByCategory: IMarkListByCategory[];

  private constructor(markListByCategory: IMarkListByCategory[]) {
    this._markListByCategory = markListByCategory;
  }

  static from(
    markListByCategory: IMarkListByCategory[],
  ): GetMarkListByCategoryResponseDto {
    return new GetMarkListByCategoryResponseDto(markListByCategory);
  }

  @Expose()
  get markListByCategory(): IMarkListByCategory[] {
    return this._markListByCategory;
  }
}
