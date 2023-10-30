import { ISchedulesOnSpecificDate } from '../types';

export class GetScheduleOnSpecificDateResponseDto {
  private readonly solarDate: string;
  private readonly lunarDate: string;
  private readonly schedulesOnSpecificDate: ISchedulesOnSpecificDate[];

  private constructor(
    solarDate: string,
    lunarDate: string,
    schedulesOnSpecificDate: ISchedulesOnSpecificDate[],
  ) {
    this.solarDate = solarDate;
    this.lunarDate = lunarDate;
    this.schedulesOnSpecificDate = schedulesOnSpecificDate;
  }

  static from(
    solarDate: string,
    lunarDate: string,
    schedulesOnSpecificDate: ISchedulesOnSpecificDate[],
  ): GetScheduleOnSpecificDateResponseDto {
    return new GetScheduleOnSpecificDateResponseDto(
      solarDate,
      lunarDate,
      schedulesOnSpecificDate,
    );
  }
}
