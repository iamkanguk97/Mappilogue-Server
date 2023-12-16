import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';

export type TMarkCategoryWithMarkCount = MarkCategoryEntity & {
  markCount: number;
};
