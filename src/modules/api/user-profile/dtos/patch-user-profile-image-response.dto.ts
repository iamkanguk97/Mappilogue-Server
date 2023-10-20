export class PatchUserProfileImageResponseDto {
  private readonly userId: number;
  private readonly profileImageUrl: string;

  private constructor(userId: number, profileImageUrl: string) {
    this.userId = userId;
    this.profileImageUrl = profileImageUrl;
  }

  static from(
    userId: number,
    profileImageUrl: string,
  ): PatchUserProfileImageResponseDto {
    return new PatchUserProfileImageResponseDto(userId, profileImageUrl);
  }
}
