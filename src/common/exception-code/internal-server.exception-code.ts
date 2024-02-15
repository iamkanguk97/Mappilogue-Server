import { setExceptionCode } from '../common';

export const InternalServerExceptionCode = {
  InternalServerError: setExceptionCode('9001', '서버 내부 에러 발생'),
  ContextNotSetting: setExceptionCode('9002', 'Validation Context Not Set!'),
  NotificationSchedulerError: setExceptionCode(
    '9003',
    '알림 스케줄러 에러 발생',
  ),
  KakaoInternalServerError: setExceptionCode('9005', '카카오 내부 서버 에러'),
  UnExpectedFieldError: setExceptionCode('9006', 'Unexpected Field'), // 예상치 못한 Field 사용 (ex. multer 사용시 body로 들어온 파일 개수)
  CreateAppleSecretKeyError: setExceptionCode(
    '9007',
    'Apple Secret Key를 생성하는 도중 에러가 발생했습니다.',
  ),
  AppleUserWithdrawError: setExceptionCode(
    '9008',
    '애플 로그인 유저 탈퇴처리를 하는 도중 에러가 발생했습니다.',
  ),
};
