import { setExceptionCode } from '../common';

export const MarkExceptionCode = {
  MarkIdEmpty: setExceptionCode('5001', '기록 아이디를 입력해주세요.'),
  MarkNotExist: setExceptionCode('5002', '존재하지 않는 기록입니다.'),
  MarkNotMine: setExceptionCode('5003', '본인의 기록이 아닙니다.'),
};
