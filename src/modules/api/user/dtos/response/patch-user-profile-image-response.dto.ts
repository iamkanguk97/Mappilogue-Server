import { Exclude, Expose } from 'class-transformer';

export class PatchUserProfileImageResponseDto {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _profileImageUrl: string;

  private constructor(userId: number, profileImageUrl: string) {
    this._userId = userId;
    this._profileImageUrl = profileImageUrl;
  }

  static from(
    userId: number,
    profileImageUrl: string,
  ): PatchUserProfileImageResponseDto {
    return new PatchUserProfileImageResponseDto(userId, profileImageUrl);
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  get profileImageUrl(): string {
    return this._profileImageUrl;
  }
}
