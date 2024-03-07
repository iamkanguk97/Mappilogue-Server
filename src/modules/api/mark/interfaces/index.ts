import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkEntity } from '../entities/mark.entity';

// 기록 카테고리 조회 API Interface
export interface IMarkCategoryWithMarkCount
  extends Pick<
    MarkCategoryEntity,
    'id' | 'title' | 'isMarkedInMap' | 'sequence'
  > {
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

export interface ISelectMarkByIdExceptMetadata {
  id: number;
  title: string;
  content: string | null;
  markCategoryId: number | null;
  markCategoryTitle: string;
  scheduleAreaId: number | null;
  name: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
  markDate: string;
}
