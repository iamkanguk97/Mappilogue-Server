import { IScheduleAreasById } from '../types';

export class GetScheduleAreasByIdResponseDto {
  private readonly areas: IScheduleAreasById[];

  private constructor(areas: IScheduleAreasById[]) {
    this.areas = areas;
  }

  static of(areas: IScheduleAreasById[]): GetScheduleAreasByIdResponseDto {
    return new GetScheduleAreasByIdResponseDto(areas);
  }
}
