import { Exclude, Expose } from 'class-transformer';

export class TokenDto {
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  static from(accessToken: string, refreshToken: string): TokenDto {
    return new TokenDto(accessToken, refreshToken);
  }

  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @Expose()
  get refreshToken(): string {
    return this._refreshToken;
  }
}
