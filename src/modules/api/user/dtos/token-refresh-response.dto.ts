import { Exclude, Expose } from 'class-transformer';
import { TokenDto } from './token.dto';

export class TokenRefreshResponseDto {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _refreshToken: string;

  private constructor(userId: number, tokenDto: TokenDto) {
    this._userId = userId;
    this._accessToken = tokenDto.accessToken;
    this._refreshToken = tokenDto.refreshToken;
  }

  static from(userId: number, tokenDto: TokenDto): TokenRefreshResponseDto {
    return new TokenRefreshResponseDto(userId, tokenDto);
  }

  @Expose()
  get userId(): number {
    return this._userId;
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
