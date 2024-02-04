import { UserGenderEnum } from 'src/modules/api/user/constants/user.enum';
import { TokenTypeEnum } from '../constants/auth.enum';

export interface ICustomJwtPayload {
  userId: number;
  iat: number;
  exp: number;
  sub: TokenTypeEnum;
}

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

export interface IVerifyAppleAuthCode {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}
