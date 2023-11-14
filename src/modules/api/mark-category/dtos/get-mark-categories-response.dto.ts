import { MarkCategoryDto } from './mark-category.dto';

export class GetMarkCategoriesResponseDto {
  private readonly totalCategoryMarkCount: number;
  private readonly markCategories: MarkCategoryDto[];

  private constructor(
    totalCategoryMarkCount: number,
    markCategories: MarkCategoryDto[],
  ) {
    this.totalCategoryMarkCount = totalCategoryMarkCount;
    this.markCategories = markCategories;
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
