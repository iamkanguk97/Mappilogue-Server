import { Exclude, Expose } from 'class-transformer';
import { IScheduleAreasById } from '../../types';

export class GetScheduleAreasByIdResponseDto {
  @Exclude() private readonly _areas: IScheduleAreasById[];

  private constructor(areas: IScheduleAreasById[]) {
    this._areas = areas;
  }

  static of(areas: IScheduleAreasById[]): GetScheduleAreasByIdResponseDto {
    return new GetScheduleAreasByIdResponseDto(areas);
  }

  @Expose()
  get areas(): IScheduleAreasById[] {
    return this._areas;
  }
}
