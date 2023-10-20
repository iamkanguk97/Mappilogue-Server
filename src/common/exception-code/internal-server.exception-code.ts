import { setExceptionCode } from '../common';

export const InternalServerExceptionCode = {
  UnCatchedError: setExceptionCode('9001', '서버 내부 에러 발생'),
  KakaoInternalServerError: setExceptionCode('9005', '카카오 내부 서버 에러'),
  UnExpectedError: setExceptionCode('9006', 'Unexpected Field'), // 예상치 못한 Field 사용 (ex. multer 사용시 body로 들어온 파일 개수)
};
