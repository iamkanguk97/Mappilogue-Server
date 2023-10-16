import { setExceptionCode } from '../common';

export const AuthExceptionCode = {
  InvalidRefreshToken: setExceptionCode(
    '0001',
    '유효하지 않은 Refresh-Token을 입력하셨습니다.',
  ),
};
