import { SocialKakaoFactory } from 'src/modules/core/auth/factories/social-kakao.factory';
import { UserSnsTypeEnum } from '../constants/user.enum';
import { SocialAppleFactory } from 'src/modules/core/auth/factories/social-apple.factory';
import { SocialFactoryType } from 'src/modules/core/auth/types';

export class UserSocialFactory {
  private readonly userSnsType: UserSnsTypeEnum;
  private readonly socialAccessToken: string;

  constructor(userSnsType: UserSnsTypeEnum, socialAccessToken: string) {
    this.userSnsType = userSnsType;
    this.socialAccessToken = socialAccessToken;
  }

  setSocialFactory(): SocialFactoryType {
    switch (this.userSnsType) {
      case UserSnsTypeEnum.KAKAO:
        return new SocialKakaoFactory(this.socialAccessToken);
      case UserSnsTypeEnum.APPLE:
        return new SocialAppleFactory(this.socialAccessToken);
    }
  }
}
