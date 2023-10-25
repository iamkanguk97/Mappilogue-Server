import { Injectable } from '@nestjs/common';
import { JwtHelper } from '../helpers/jwt.helper';
import { TokenDto } from 'src/modules/api/user/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async setUserToken(userId: number): Promise<TokenDto> {
    const accessToken = this.jwtHelper.generateAccessToken(userId);
    const refreshToken = this.jwtHelper.generateRefreshToken(userId);
    await this.jwtHelper.setRefreshTokenInRedis(userId, refreshToken);
    return TokenDto.from(accessToken, refreshToken);
  }
}
