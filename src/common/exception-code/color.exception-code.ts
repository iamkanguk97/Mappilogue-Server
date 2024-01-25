import { setExceptionCode } from '../common';

export const ColorExceptionCode = {
  ColorIdRangeError: setExceptionCode(
    '3001',
    '색깔 고유값은 최소 1, 최대 15까지 입력 가능합니다.',
  ),
  ColorNotExist: setExceptionCode(
    '3002',
    '요청하신 색깔을 찾을 수 없습니다. 관리자에게 문의해주세요.',
  ),
};
