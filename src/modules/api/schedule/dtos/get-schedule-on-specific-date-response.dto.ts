import { Exclude, Expose } from 'class-transformer';
import { ISchedulesOnSpecificDate } from '../types';

export class GetScheduleOnSpecificDateResponseDto {
  @Exclude()
  private readonly _solarDate: string;
  @Exclude()
  private readonly _lunarDate: string;
  @Exclude()
  private readonly _schedulesOnSpecificDate: ISchedulesOnSpecificDate[];

  private constructor(
    solarDate: string,
    lunarDate: string,
    schedulesOnSpecificDate: ISchedulesOnSpecificDate[],
  ) {
    this._solarDate = solarDate;
    this._lunarDate = lunarDate;
    this._schedulesOnSpecificDate = schedulesOnSpecificDate;
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

  @Expose()
  get solarDate(): string {
    return this._solarDate;
  }

  @Expose()
  get lunarDate(): string {
    return this._lunarDate;
  }

  @Expose()
  get schedulesOnSpecificDate(): ISchedulesOnSpecificDate[] {
    return this._schedulesOnSpecificDate;
  }
}
