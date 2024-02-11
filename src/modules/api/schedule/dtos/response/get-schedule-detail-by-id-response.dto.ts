import { Exclude, Expose } from 'class-transformer';
import { IProcessedScheduleAreasById } from '../../types';
import { ScheduleDto } from '../schedule.dto';

export class GetScheduleDetailByIdResponseDto {
  @Exclude() private readonly _scheduleBaseInfo: ScheduleDto;
  @Exclude() private readonly _scheduleAlarmInfo: Array<string | null>;
  @Exclude() private readonly _scheduleAreaInfo: IProcessedScheduleAreasById[];

  private constructor(
    scheduleBaseInfo: ScheduleDto,
    scheduleAlarmInfo: Array<string | null>,
    scheduleAreaInfo: IProcessedScheduleAreasById[],
  ) {
    this._scheduleBaseInfo = scheduleBaseInfo;
    this._scheduleAlarmInfo = scheduleAlarmInfo;
    this._scheduleAreaInfo = scheduleAreaInfo;
  }

  static from(
    scheduleBaseInfo: ScheduleDto,
    scheduleAlarmInfo: Array<string | null>,
    scheduleAreaInfo: IProcessedScheduleAreasById[],
  ) {
    return new GetScheduleDetailByIdResponseDto(
      scheduleBaseInfo,
      scheduleAlarmInfo,
      scheduleAreaInfo,
    );
  }

  @Expose()
  get scheduleBaseInfo(): ScheduleDto {
    return this._scheduleBaseInfo;
  }

  @Expose()
  get scheduleAlarmInfo(): Array<string | null> {
    return this._scheduleAlarmInfo;
  }

  @Expose()
  get scheduleAreaInfo(): IProcessedScheduleAreasById[] {
    return this._scheduleAreaInfo;
  }
}
