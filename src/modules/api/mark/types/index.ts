import { MarkCategoryEntity } from '../entities/mark-category.entity';

export type TMarkCategoryWithMarkCount = MarkCategoryEntity & {
  markCount: number;
};
