import { setExceptionCode } from '../common';

export const InternalServerExceptionCode = {
  UnCatchedError: setExceptionCode('9001', '서버 내부 에러 발생'),
  KakaoInternalServerError: setExceptionCode('9005', '카카오 내부 서버 에러'),
};
