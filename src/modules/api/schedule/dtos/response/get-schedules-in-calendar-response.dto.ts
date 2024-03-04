import { Exclude, Expose } from 'class-transformer';
import { ISchedulesInCalendar } from '../../types';

export class GetSchedulesInCalendarResponseDto {
  @Exclude() private readonly _calendarSchedules: ISchedulesInCalendar[];

  private constructor(calendarSchedules: ISchedulesInCalendar[]) {
    this._calendarSchedules = calendarSchedules;
  }

  static of(
    calendarSchedules: ISchedulesInCalendar[],
  ): GetSchedulesInCalendarResponseDto {
    return new GetSchedulesInCalendarResponseDto(calendarSchedules);
  }

  @Expose()
  get calendarSchedules(): ISchedulesInCalendar[] {
    return this._calendarSchedules;
  }
}
