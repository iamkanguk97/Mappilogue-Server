import { KakaoErrorCode } from '../constants/auth.constant';

export type KakaoErrorCodeType =
  (typeof KakaoErrorCode)[keyof typeof KakaoErrorCode];
