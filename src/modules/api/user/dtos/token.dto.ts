export class TokenDto {
  private readonly userId: number;
  private readonly accessToken: string;
  private readonly refreshToken: string;

  private constructor(userId, accessToken, refreshToken) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static from(userId, accessToken, refreshToken) {
    return new TokenDto(userId, accessToken, refreshToken);
  }
}
