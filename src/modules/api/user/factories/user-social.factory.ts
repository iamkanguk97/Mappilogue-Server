import { SocialKakaoFactory } from 'src/modules/core/auth/factories/social-kakao.factory';
import { UserSnsTypeEnum } from '../constants/user.enum';
import { SocialAppleFactory } from 'src/modules/core/auth/factories/social-apple.factory';
import { TSocialFactory } from 'src/modules/core/auth/types';

export class UserSocialFactory {
  private readonly userSnsType: UserSnsTypeEnum;
  private readonly socialAccessToken: string;

  private constructor(userSnsType: UserSnsTypeEnum, socialAccessToken: string) {
    this.userSnsType = userSnsType;
    this.socialAccessToken = socialAccessToken;
  }

  static from(
    userSnsType: UserSnsTypeEnum,
    socialAccessToken: string,
  ): UserSocialFactory {
    return new UserSocialFactory(userSnsType, socialAccessToken);
  }

  /**
   * @summary Vendor에 따라 소셜 구분하는 함수
   * @author  Jason
   * @returns { TSocialFactory }
   */
  setSocialFactory(): TSocialFactory {
    switch (this.userSnsType) {
      case UserSnsTypeEnum.KAKAO:
        return new SocialKakaoFactory(this.socialAccessToken);
      case UserSnsTypeEnum.APPLE:
        return new SocialAppleFactory(this.socialAccessToken);
    }
  }
}
