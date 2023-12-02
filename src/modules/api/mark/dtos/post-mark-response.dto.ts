import { Exclude, Expose } from 'class-transformer';

export class PostMarkResponseDto {
  @Exclude() private readonly _newMarkId: number;

  private constructor(newMarkId: number) {
    this._newMarkId = newMarkId;
  }

  static of(newMarkId: number): PostMarkResponseDto {
    return new PostMarkResponseDto(newMarkId);
  }

  @Expose()
  get newMarkId(): number {
    return this._newMarkId;
  }
}
