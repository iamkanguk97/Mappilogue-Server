export class GetScheduleDetailByIdResponseDto {
  private readonly scheduleBaseInfo: any;
  private readonly scheduleAlarmInfo: any[];
  private readonly scheduleAreaInfo: any[];

  private constructor(
    scheduleBaseInfo: any,
    scheduleAlarmInfo: any,
    scheduleAreaInfo: any,
  ) {
    this.scheduleBaseInfo = scheduleBaseInfo;
    this.scheduleAlarmInfo = scheduleAlarmInfo;
    this.scheduleAreaInfo = scheduleAreaInfo;
  }

  static from(scheduleBaseInfo, scheduleAlarmInfo, scheduleAreaInfo) {
    return new GetScheduleDetailByIdResponseDto(
      scheduleBaseInfo,
      scheduleAlarmInfo,
      scheduleAreaInfo,
    );
  }
}
