import { KakaoErrorCode } from '../constants/auth.constant';
import { TokenTypeEnum } from '../constants/auth.enum';

export type KakaoErrorCodeType =
  (typeof KakaoErrorCode)[keyof typeof KakaoErrorCode];

export interface JwtRefreshPayload {
  userId: number;
  iat: bigint;
  exp: bigint;
  sub: TokenTypeEnum;
}
