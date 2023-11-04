import { IProcessedScheduleAreasById } from '../types';
import { ScheduleDto } from './schedule.dto';

export class GetScheduleDetailByIdResponseDto {
  private readonly scheduleBaseInfo: ScheduleDto;
  private readonly scheduleAlarmInfo: Array<string | undefined>;
  private readonly scheduleAreaInfo: IProcessedScheduleAreasById[];

  private constructor(
    scheduleBaseInfo: ScheduleDto,
    scheduleAlarmInfo: Array<string | undefined>,
    scheduleAreaInfo: IProcessedScheduleAreasById[],
  ) {
    this.scheduleBaseInfo = scheduleBaseInfo;
    this.scheduleAlarmInfo = scheduleAlarmInfo;
    this.scheduleAreaInfo = scheduleAreaInfo;
  }

  static from(
    scheduleBaseInfo: ScheduleDto,
    scheduleAlarmInfo: Array<string | undefined>,
    scheduleAreaInfo: IProcessedScheduleAreasById[],
  ) {
    return new GetScheduleDetailByIdResponseDto(
      scheduleBaseInfo,
      scheduleAlarmInfo,
      scheduleAreaInfo,
    );
  }
}
