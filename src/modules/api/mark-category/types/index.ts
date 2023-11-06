import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';

export type TMarkCategoryByUserId = MarkCategoryEntity & {
  markCount: number;
};
