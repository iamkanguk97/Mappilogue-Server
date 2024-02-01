import { UserGenderEnum } from 'src/modules/api/user/constants/user.enum';
import { TokenTypeEnum } from '../constants/auth.enum';
import { SocialAppleFactory } from '../factories/social-apple.factory';
import { SocialKakaoFactory } from '../factories/social-kakao.factory';

export interface ICustomJwtPayload {
  userId: number;
  iat: number;
  exp: number;
  sub: TokenTypeEnum;
}

// 소셜로그인 Factory Method 인터페이스
export interface ISocialFactoryMethod {
  validateSocialAccessToken(): Promise<string>;
}

// 카카오에서 검증 후 반환해주는 데이터 인터페이스
export interface ISocialKakaoDataInfo {
  id: number;
  connected_at?: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnal_image?: string;
  };
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email?: string;
    has_age_range: boolean;
    age_range_needs_agreement: boolean;
    age_range?: string;
    has_birthday: boolean;
    birthday_needs_agreement: boolean;
    birthday?: string;
    birthday_type?: 'SOLAR' | 'LUNAR';
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender?: UserGenderEnum;
  };
}

// 애플로그인 검증 후 결과 토큰 Payload (아직 미정)
export interface IAppleJwtTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email?: string;
  email_verified?: string;
  is_private_email?: string;
  auth_time: number;
  nonce_supported: boolean;
}

export type TSocialFactory = SocialKakaoFactory | SocialAppleFactory;
