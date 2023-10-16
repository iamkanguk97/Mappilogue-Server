export class TokenDto {
  private readonly accessToken: string;
  private readonly refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  get getAccessToken() {
    return this.accessToken;
  }

  get getRefreshToken() {
    return this.refreshToken;
  }

  static from(accessToken: string, refreshToken: string) {
    return new TokenDto(accessToken, refreshToken);
  }
}
