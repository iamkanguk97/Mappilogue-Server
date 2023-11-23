import { Exclude, Expose } from 'class-transformer';
import { ISchedulesInCalender } from '../types';

export class GetSchedulesInCalenderResponseDto {
  @Exclude() private readonly _calenderSchedules: ISchedulesInCalender[];

  private constructor(calenderSchedules: ISchedulesInCalender[]) {
    this._calenderSchedules = calenderSchedules;
  }

  static of(
    calenderSchedules: ISchedulesInCalender[],
  ): GetSchedulesInCalenderResponseDto {
    return new GetSchedulesInCalenderResponseDto(calenderSchedules);
  }

  @Expose()
  get calenderSchedules(): ISchedulesInCalender[] {
    return this._calenderSchedules;
  }
}
