import { setExceptionCode } from '../common';

export const UserExceptionCode = {
  SocialAccessTokenEmpty: setExceptionCode(
    '1001',
    '소셜의 Access-Token을 입력해주세요.',
  ),
  SocialVendorEmpty: setExceptionCode(
    '1002',
    '소셜로그인 타입을 입력해주세요.',
  ),
  SocialVendorErrorType: setExceptionCode(
    '1003',
    '잘못된 소셜로그인 타입입니다.',
  ),
  RefreshTokenEmpty: setExceptionCode('1004', 'Refresh-Token을 입력해주세요.'),
  InvalidRefreshToken: setExceptionCode(
    '1005',
    '유효하지 않은 Refresh-Token을 입력하셨습니다.',
  ),
  InvalidKakaoAccessToken: setExceptionCode(
    '1006',
    '유효하지 않은 카카오 Access-Token을 입력하셨습니다.',
  ),
  InvalidKakaoRequestForm: setExceptionCode(
    '1007',
    '카카오 요청시 Request-Form이 잘못되었습니다.',
  ),
};
