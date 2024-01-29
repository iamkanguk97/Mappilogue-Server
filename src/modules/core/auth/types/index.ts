import { UserGenderEnum } from 'src/modules/api/user/constants/user.enum';
import { TokenTypeEnum } from '../constants/auth.enum';
import { SocialAppleFactory } from '../factories/social-apple.factory';
import { SocialKakaoFactory } from '../factories/social-kakao.factory';

export interface SocialFactoryInterface {
  validateSocialAccessToken(): Promise<string>;
  // TODO: Type 지정해주기
  processingSocialInfo(socialInfo: any): any;
}

export interface ICustomJwtPayload {
  userId: number;
  iat: number;
  exp: number;
  sub: TokenTypeEnum;
}

export interface SocialKakaoDataInfo {
  id: number;
  connected_at?: string | undefined;
  properties?:
    | {
        nickname?: string | undefined;
        profile_image?: string | undefined;
        thumbnal_image?: string | undefined;
      }
    | undefined;
  kakao_account?:
    | {
        profile_nickname_needs_agreement?: boolean;
        profile_image_needs_agreement?: boolean;
        profile?:
          | {
              nickname?: string | undefined;
              thumbnail_image_url?: string | undefined;
              profile_image_url?: string | undefined;
              is_default_image?: boolean;
            }
          | undefined;
        has_email: boolean;
        email_needs_agreement: boolean;
        is_email_valid: boolean;
        is_email_verified: boolean;
        email?: string | undefined;
        has_age_range: boolean;
        age_range_needs_agreement: boolean;
        age_range?: string | undefined;
        has_birthday: boolean;
        birthday_needs_agreement: boolean;
        birthday?: string | undefined;
        birthday_type?: 'SOLAR' | 'LUNAR' | undefined;
        has_gender: boolean;
        gender_needs_agreement: boolean;
        gender?: UserGenderEnum | undefined;
      }
    | undefined;
}

export interface AppleJwtTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email?: string | undefined;
  email_verified?: string | undefined;
  is_private_email?: string | undefined;
  auth_time: number;
  nonce_supported: boolean;
}

export type SocialFactoryType = SocialKakaoFactory | SocialAppleFactory;
