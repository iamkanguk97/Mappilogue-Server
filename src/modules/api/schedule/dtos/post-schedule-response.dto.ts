export class PostScheduleResponseDto {
  private readonly newScheduleId: number;

  private constructor(newScheduleId: number) {
    this.newScheduleId = newScheduleId;
  }

  static of(newScheduleId: number): PostScheduleResponseDto {
    return new PostScheduleResponseDto(newScheduleId);
  }
}
