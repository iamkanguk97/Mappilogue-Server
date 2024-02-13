import { Exclude, Expose } from 'class-transformer';

export class PostAutoLoginResponseDto {
  @Exclude() private readonly _userId: number;

  private constructor(userId: number) {
    this._userId = userId;
  }

  static of(userId: number): PostAutoLoginResponseDto {
    return new PostAutoLoginResponseDto(userId);
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }
}
