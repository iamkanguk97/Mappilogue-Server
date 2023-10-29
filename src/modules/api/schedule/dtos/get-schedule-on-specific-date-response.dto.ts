export class GetScheduleOnSpecificDateResponseDto {
  private readonly solarDate: string;
  private readonly lunarDate: string;

  private constructor(solarDate: string, lunarDate: string) {
    this.solarDate = solarDate;
    this.lunarDate = lunarDate;
  }

  static from(
    solarDate: string,
    lunarDate: string,
  ): GetScheduleOnSpecificDateResponseDto {
    return new GetScheduleOnSpecificDateResponseDto(solarDate, lunarDate);
  }
}
