import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth.helper';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import { JwtHelper } from '../helpers/jwt.helper';
import { JwtService } from '@nestjs/jwt';
import { CustomCacheService } from '../../custom-cache/services/custom-cache.service';
import { UserService } from 'src/modules/api/user/services/user.service';
import { TokenDto } from 'src/modules/api/user/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async validateSocialAccessToken(
    socialAccessToken: string,
    snsType: string,
  ): Promise<string> {
    switch (snsType) {
      case UserSnsTypeEnum.KAKAO:
        return this.authHelper.validateKakaoAccessToken(socialAccessToken);
      // case 'APPLE':
      //   return this.authHelper.validateAppleAccessToken(socialAccessToken);
      default:
        throw new InternalServerErrorException('유효하지 않은 로그인 타입');
    }
  }

  async setUserToken(userId: number): Promise<TokenDto> {
    const accessToken = this.jwtHelper.generateAccessToken(userId);
    const refreshToken = this.jwtHelper.generateRefreshToken(userId);
    return TokenDto.from(userId, accessToken, refreshToken);
  }
}
