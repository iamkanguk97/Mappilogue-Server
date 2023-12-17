import { MarkCategoryEntity } from '../entities/mark-category.entity';

export type TMarkCategoryWithMarkCount = MarkCategoryEntity & {
  markCount: number;
};

export type TMarkImages =
  | {
      [fieldname: string]: Express.Multer.File[];
    }
  | Express.Multer.File[];
