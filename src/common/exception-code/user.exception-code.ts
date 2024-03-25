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
  ImageFileFormatError: setExceptionCode(
    '1012',
    '이미지 파일 형식이 올바르지 않습니다.',
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
  RequireAlarmAcceptInSchedule: setExceptionCode(
    '1017',
    '일정 알림 서비스를 이용하시려면 알림 설정을 해주세요.',
  ),
  RequireFcmTokenRegister: setExceptionCode(
    '1018',
    'FCM Token을 등록해주세요.',
  ),
  InvalidFcmToken: setExceptionCode('1019', '유효하지 않은 FCM Token입니다.'),
  WithdrawReasonLengthError: setExceptionCode(
    '1020',
    '회원탈퇴 사유는 최대 200자까지 입력 가능합니다.',
  ),
  NotExistUser: setExceptionCode('1021', '존재하지 않는 사용자입니다.'),
  GetUserHomeOptionEmpty: setExceptionCode(
    '1022',
    '홈화면 조회 옵션을 입력해주세요.',
  ),
  GetUserHomeOptionErrorType: setExceptionCode(
    '1023',
    '홈화면 조회 옵션은 NOW 또는 AFTER로 입력해주세요.',
  ),
  GetUserAlarmSettingsNoResult: setExceptionCode(
    '1024',
    '사용자 알림 설정 내역 조회 결과값이 없습니다. 관리자에게 문의해주세요.',
  ),
  GetUserAlarmSettingNotExist: setExceptionCode(
    '1025',
    '사용자 알림 설정 조회 결과가 없습니다.',
  ),
  FcmTokenExpired: setExceptionCode('1026', '만료된 FCM Token 입니다.'),
  GetHomeOptionEmpty: setExceptionCode(
    '1027',
    '홈화면 조회 옵션을 입력해주세요.',
  ),
  GetHomeOptionErrorType: setExceptionCode(
    '1028',
    '홈화면 조회 옵션은 today 또는 after로 입력해주세요.',
  ),
  AppleSocialLoginTokenError: setExceptionCode(
    '1029',
    '잘못된 요청으로 애플로그인을 처리할 수 없습니다. 만료되었거나 이미 사용된 토큰인지, 잘못된 토큰인지 확인해주세요.',
  ),
  AccessTokenInBlackList: setExceptionCode(
    '1030',
    '블랙리스트에 추가된 토큰입니다.',
  ),
  AppleTokenEmptyInWithdraw: setExceptionCode(
    '1031',
    '애플로그인으로 가입한 유저는 회원탈퇴 시 인증토큰이 필요합니다.',
  ),
  // IsMarketingConsentGivenEmpty: setExceptionCode(
  //   '1032',
  //   '마케팅 수신 동의 여부를 입력해주세요.',
  // ),
  SignUpBirthdayEmpty: setExceptionCode(
    '1033',
    '회원가입 시에는 생년월일을 입력해주셔야합니다.',
  ),
  SignUpBirthdayFormatError: setExceptionCode(
    '1034',
    '회원가입 시 작성하는 생년월일은 YYYY-MM-DD 형태로 입력해주시고 유효한 생년월일을 입력해주세요.',
  ),
};
