export class TokenDto {
  private readonly accessToken: string;
  private readonly refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  get getAccessToken(): string {
    return this.accessToken;
  }

  get getRefreshToken(): string {
    return this.refreshToken;
  }

  static from(accessToken: string, refreshToken: string): TokenDto {
    return new TokenDto(accessToken, refreshToken);
  }
}
