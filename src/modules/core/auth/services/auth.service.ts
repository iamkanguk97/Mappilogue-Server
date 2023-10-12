import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth.helper';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import { JwtHelper } from '../helpers/jwt.helper';
import { JwtService } from '@nestjs/jwt';
import { CustomCacheService } from '../../custom-cache/services/custom-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly jwtHelper: JwtHelper,
    private readonly jwtService: JwtService,
    private readonly customCacheService: CustomCacheService,
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

  async setUserToken(userId: number) {
    const accessToken = this.jwtHelper.generateAccessToken(userId);
    const refreshToken = this.jwtHelper.generateRefreshToken(userId);
    return;
  }

  async tokenRefresh(refreshToken: string) {
    const refreshPayload = this.jwtService.decode(refreshToken);

    const userId = refreshPayload['userId'];
    const checkUserStatus = 1;
    const refreshTokenInRedis = await this.customCacheService.getValue(
      'COLORS_KEY',
    );
    await this.setUserToken(userId);
  }
}
