export const KAKAO_ACCESS_TOKEN_VERIFY_URL =
  'https://kapi.kakao.com/v1/user/access_token_info';
export const JWKS_URI = 'https://appleid.apple.com/auth/keys';

export const KakaoErrorCode = {
  Unauthorized: -401,
  KakaoInternalServerError: -1,
  InvalidRequestForm: -2,
} as const;

// Apple jwksClient Token
export const JWKS_CLIENT_TOKEN = 'JWKS_CLIENT_TOKEN';
