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

export interface IScheduleAreasById {
  scheduleAreaId: number;
  scheduleId: number;
  date: string;
  name: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
  time: string;
  sequence: number;
}
