import { CheckColumnEnum } from 'src/constants/enum';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';

export interface ISchedulesInCalendar {
  scheduleId: number;
  userId: number;
  colorId: number;
  startDate: string;
  endDate: string;
  title: string;
  colorCode: string;
}

export interface ISolarToLunarResult {
  lYear: number;
  lMonth: number;
  lDay: number;
  animal: string;
  yearCn: string;
  monthCn: string;
  dayCn: string;
  cYear: number;
  cMonth: number;
  cDay: number;
  gzYear: string;
  gzMonth: string;
  gzDay: string;
  isToday: boolean;
  isLeap: boolean;
  nWeek: number;
  ncWeek: string;
  isTerm: boolean;
  term: string;
}

export interface ISchedulesOnSpecificDate
  extends Omit<ISchedulesInCalendar, 'userId'> {
  areaName: string;
  areaTime: string;
}

export interface IScheduleAreasById extends ScheduleAreaEntity {
  scheduleAreaId: number;
  isRepLocation: CheckColumnEnum;
}

export interface IProcessedScheduleAreasById {
  date: string;
  value: Omit<IScheduleAreasById, 'scheduleId' | 'date'>[];
}

// 홈화면 조회 -> 오늘의 일정 리스트 결과값 인터페이스
export interface IScheduleListInHomeOnToday
  extends Pick<ScheduleEntity, 'id' | 'title' | 'colorId'> {
  colorCode: string;
  areas?: ScheduleAreaEntity[];
}

export type TSchedulesByYearAndMonth = ISchedulesOnSpecificDate & {
  scheduleAreaId: number;
  sequence: number;
};

export interface ISchedulesInPostMark {
  [date: string]: TSchedulesByYearAndMonth;
}
