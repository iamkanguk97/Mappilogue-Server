import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkEntity } from '../entities/mark.entity';

export interface IMarkCategoryWithMarkCount extends MarkCategoryEntity {
  markCount: number;
}

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

// 홈화면 조회 API -> 기록 리스트 부분 interface
export interface IMarkListInHome
  extends Pick<
    MarkEntity,
    'id' | 'title' | 'markCategoryId' | 'colorId' | 'createdAt'
  > {
  markCategoryTitle: string;
  colorCode: string;
  markImageUrl: string;
}
