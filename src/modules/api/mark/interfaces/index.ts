import { ScheduleAreaEntity } from '../../schedule/entities/schedule-area.entity';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { MarkEntity } from '../entities/mark.entity';

// 기록 카테고리 조회 API Interface
export interface IMarkCategoryWithMarkCount
  extends Pick<
    MarkCategoryEntity,
    'id' | 'title' | 'isMarkedInMap' | 'sequence'
  > {
  markCount: number;
}

// 특정 카테고리의 기록 리스트 Interface
export interface IMarkListByCategory
  extends Pick<MarkEntity, 'id' | 'markCategoryId' | 'title' | 'colorId'>,
    Pick<MarkMetadataEntity, 'markImageUrl'>,
    Pick<
      MarkLocationEntity | ScheduleAreaEntity,
      'name' | 'latitude' | 'longitude' | 'streetAddress'
    > {
  markCategoryTitle: string;
  colorCode: string;
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

// 기록 검색 -> 기록 이름으로 검색 Interface
export interface IMarkSearchByMark
  extends Pick<MarkEntity, 'id' | 'scheduleId' | 'title' | 'colorId'>,
    Pick<MarkLocationEntity, 'scheduleAreaId'>,
    Pick<
      MarkLocationEntity | ScheduleAreaEntity,
      'name' | 'streetAddress' | 'latitude' | 'longitude'
    >,
    Pick<ScheduleAreaEntity, 'date'> {
  colorCode: string;
}

// 기록 검색 -> 지역 이름으로 검색 Interface
export interface IMarkSearchByArea
  extends Pick<
    IMarkSearchByMark,
    | 'id'
    | 'streetAddress'
    | 'name'
    | 'latitude'
    | 'longitude'
    | 'scheduleAreaId'
  > {
  markLocationId: number;
}
