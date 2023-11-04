import { ISchedulesInCalender } from '../types';

export class GetSchedulesInCalenderResponseDto {
  private readonly calenderSchedules: ISchedulesInCalender[];

  private constructor(calenderSchedules: ISchedulesInCalender[]) {
    this.calenderSchedules = calenderSchedules;
  }

  static of(
    calenderSchedules: ISchedulesInCalender[],
  ): GetSchedulesInCalenderResponseDto {
    return new GetSchedulesInCalenderResponseDto(calenderSchedules);
  }
}
