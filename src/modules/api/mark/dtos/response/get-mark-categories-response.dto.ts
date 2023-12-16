import { Exclude, Expose } from 'class-transformer';
import { MarkCategoryDto } from '../mark-category.dto';

export class GetMarkCategoriesResponseDto {
  @Exclude() private readonly _totalCategoryMarkCount: number;
  @Exclude() private readonly _markCategories: MarkCategoryDto[];

  private constructor(
    totalCategoryMarkCount: number,
    markCategories: MarkCategoryDto[],
  ) {
    this._totalCategoryMarkCount = totalCategoryMarkCount;
    this._markCategories = markCategories;
  }

  @Expose()
  get totalCategoryMarkCount(): number {
    return this._totalCategoryMarkCount;
  }

  @Expose()
  get markCategories(): MarkCategoryDto[] {
    return this._markCategories;
  }

  static from(
    totalCategoryMarkCount: number,
    markCategories: MarkCategoryDto[],
  ): GetMarkCategoriesResponseDto {
    return new GetMarkCategoriesResponseDto(
      totalCategoryMarkCount,
      markCategories,
    );
  }
}
