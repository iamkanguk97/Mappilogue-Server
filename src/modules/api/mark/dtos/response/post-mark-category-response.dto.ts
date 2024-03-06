import { Exclude, Expose } from 'class-transformer';
import { MarkCategoryEntity } from '../../entities/mark-category.entity';

export class PostMarkCategoryResponseDto {
  @Exclude() private readonly _markCategory: MarkCategoryEntity;

  private constructor(markCategory: MarkCategoryEntity) {
    this._markCategory = markCategory;
  }

  static of(markCategory: MarkCategoryEntity): PostMarkCategoryResponseDto {
    return new PostMarkCategoryResponseDto(markCategory);
  }

  @Expose()
  get markCategoryId(): number {
    return this._markCategory.id;
  }

  @Expose()
  get title(): string {
    return this._markCategory.title;
  }

  @Expose()
  get sequence(): number {
    return this._markCategory.sequence;
  }
}
