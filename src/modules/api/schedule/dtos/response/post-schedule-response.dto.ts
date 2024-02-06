import { Exclude, Expose } from 'class-transformer';

export class PostScheduleResponseDto {
  @Exclude() private readonly _newScheduleId: number;

  private constructor(newScheduleId: number) {
    this._newScheduleId = newScheduleId;
  }

  static of(newScheduleId: number): PostScheduleResponseDto {
    return new PostScheduleResponseDto(newScheduleId);
  }

  @Expose()
  get newScheduleId(): number {
    return this._newScheduleId;
  }
}
