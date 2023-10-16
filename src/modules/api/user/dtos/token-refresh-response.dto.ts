import { TokenDto } from './token.dto';

export class TokenRefreshResponseDto {
  private readonly userId: number;
  private readonly accessToken: string;
  private readonly refreshToken: string;

  private constructor(userId: number, tokenDto: TokenDto) {
    this.userId = userId;
    this.accessToken = tokenDto.getAccessToken;
    this.refreshToken = tokenDto.getRefreshToken;
  }

  static from(userId: number, tokenDto: TokenDto): TokenRefreshResponseDto {
    return new TokenRefreshResponseDto(userId, tokenDto);
  }
}
