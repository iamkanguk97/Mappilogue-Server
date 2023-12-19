import { MarkCategoryEntity } from '../entities/mark-category.entity';

export type TMarkCategoryWithMarkCount = MarkCategoryEntity & {
  markCount: number;
};

export type TMarkImages =
  | {
      [fieldname: string]: Express.Multer.File[];
    }
  | Express.Multer.File[];

export interface IMarkListByCategory {
  id: number;
  markCategoryId: number;
  markCategoryTitle: string;
  markTitle: string;
  colorId: number;
  colorCode: string;
  markImageUrl: string;
  locationName: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
  markDate: string;
}
