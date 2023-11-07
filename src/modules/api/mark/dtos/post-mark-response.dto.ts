export class PostMarkResponseDto {
  private readonly newMarkId: number;

  private constructor(newMarkId: number) {
    this.newMarkId = newMarkId;
  }

  static of(newMarkId: number): PostMarkResponseDto {
    return new PostMarkResponseDto(newMarkId);
  }
}
