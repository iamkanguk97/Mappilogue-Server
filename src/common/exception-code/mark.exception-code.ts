import { setExceptionCode } from '../common';

export const MarkExceptionCode = {
  MarkIdEmpty: setExceptionCode('5001', '기록 아이디를 입력해주세요.'),
  MarkNotExist: setExceptionCode('5002', '존재하지 않는 기록입니다.'),
  MarkNotMine: setExceptionCode('5003', '본인의 기록이 아닙니다.'),
  MarkColorIdEmpty: setExceptionCode(
    '5004',
    '기록에 남길 색깔 아이디를 입력해주세요.',
  ),
  MarkTitleEmpty: setExceptionCode('5005', '기록 제목을 입력해주세요.'),
  MarkTitleLengthError: setExceptionCode(
    '5006',
    '기록 제목은 최대 50자까지 입력 가능합니다.',
  ),
};
