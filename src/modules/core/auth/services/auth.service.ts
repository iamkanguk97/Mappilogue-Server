import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthHelper } from '../helpers/auth.helper';

@Injectable()
export class AuthService {
  constructor(private readonly authHelper: AuthHelper) {}

  async validateSocialAccessToken(
    socialAccessToken: string,
    snsType: string,
  ): Promise<string> {
    switch (snsType) {
      case 'KAKAO':
        return this.authHelper.validateKakaoAccessToken(socialAccessToken);
      // case 'APPLE':
      //   return this.authHelper.validateAppleAccessToken(socialAccessToken);
      default:
        throw new InternalServerErrorException('유효하지 않은 로그인 타입');
    }
  }
}
