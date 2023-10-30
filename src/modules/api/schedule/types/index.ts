export interface ISchedulesInCalender {
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

export interface ISchedulesOnSpecificDate {
  scheduleId: number;
  title: string;
  colorId: number;
  colorCode: string;
  areaName: string;
  areaTime: string;
}
