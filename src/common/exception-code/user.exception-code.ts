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
  AccessTokenEmpty: setExceptionCode('1008', 'Access-Token을 입력해주세요.'),
  InvalidAccessToken: setExceptionCode(
    '1009',
    '유효하지 않은 Access-Token을 입력하셨습니다.',
  ),
  NicknameEmpty: setExceptionCode('1010', '닉네임을 입력해주세요.'),
  NicknameFormatError: setExceptionCode(
    '1011',
    '닉네임 형식이 올바르지 않습니다.',
  ),
  ProfileImageFileFormatError: setExceptionCode(
    '1012',
    '변경하실 프로필 이미지 파일 형식이 올바르지 않습니다.',
  ),
  IsTotalAlarmEmpty: setExceptionCode('1013', '전체 알림 여부를 입력해주세요.'),
  IsNoticeAlarmEmpty: setExceptionCode(
    '1014',
    '공지사항 알림 여부를 입력해주세요.',
  ),
  IsMarketingAlarmEmpty: setExceptionCode(
    '1015',
    '마케팅 알림 여부를 입력해주세요.',
  ),
  IsScheduleReminderAlarmEmpty: setExceptionCode(
    '1016',
    '일정 알림 여부를 입력해주세요.',
  ),
};
