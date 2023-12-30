import { Injectable } from '@nestjs/common';
import { JwtHelper } from '../helpers/jwt.helper';
import { TokenDto } from 'src/modules/api/user/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtHelper: JwtHelper) {}

  /**
   * @summary 사용자 토큰 설정
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<TokenDto> }
   */
  async setUserToken(userId: number): Promise<TokenDto> {
    const accessToken = this.jwtHelper.generateAccessToken(userId);
    const refreshToken = this.jwtHelper.generateRefreshToken(userId);
    await this.jwtHelper.setRefreshTokenInRedis(userId, refreshToken);
    return TokenDto.from(accessToken, refreshToken);
  }
}
