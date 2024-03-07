import { Exclude, Expose } from 'class-transformer';
import { IMarkListInHome } from 'src/modules/api/mark/interfaces';
import { IScheduleListInHomeOnToday } from 'src/modules/api/schedule/types';

export class GetHomeResponseDto {
  @Exclude() private readonly _schedules: IScheduleListInHomeOnToday[];
  @Exclude() private readonly _marks: IMarkListInHome[];

  private constructor(
    schedules: IScheduleListInHomeOnToday[],
    marks: IMarkListInHome[],
  ) {
    this._schedules = schedules;
    this._marks = marks;
  }

  static from(
    schedules: IScheduleListInHomeOnToday[],
    marks: IMarkListInHome[],
  ): GetHomeResponseDto {
    return new GetHomeResponseDto(schedules, marks);
  }

  @Expose()
  get schedules(): IScheduleListInHomeOnToday[] {
    return this._schedules;
  }

  @Expose()
  get marks(): IMarkListInHome[] {
    return this._marks;
  }
}
