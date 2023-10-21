import { setExceptionCode } from '../common';

export const ColorExceptionCode = {
  ColorIdRangeError: setExceptionCode(
    '3001',
    '색깔 고유값은 최소 1, 최대 15까지 입력 가능합니다.',
  ),
};
