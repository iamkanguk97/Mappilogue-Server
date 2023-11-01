import { setExceptionCode } from '../common';

export const CommonExceptionCode = {
  MustStringType: setExceptionCode('8001', '문자열 타입으로 입력해주세요.'),
  MustCheckColumnType: setExceptionCode(
    '8002',
    'ACTIVE 또는 INACTIVE로 상태를 입력해주세요.',
  ),
  MustIntegerType: setExceptionCode('8003', '정수 타입으로 입력해주세요.'),
  MustPositiveType: setExceptionCode('8004', '양수 타입으로 입력해주세요.'),
  MustObjectType: setExceptionCode('8005', '객체 타입으로 입력해주세요.'),
  MustArrayType: setExceptionCode('8006', '배열 타입으로 입력해주세요.'),
  ArrayNotEmpty: setExceptionCode('8007', '빈 배열을 입력할 수 없습니다.'),
  ArrayUnique: setExceptionCode(
    '8008',
    '중복되는 배열 원소가 있으면 안됩니다.',
  ),
  MustNumberType: setExceptionCode('8009', '숫자 타입으로 입력해주세요.'),
  MustKeyNameIsDataWhenMultipart: setExceptionCode(
    '8010',
    'Multipart로 파일 이외의 데이터를 보내주실 때는 data라는 키에 데이터를 담아서 보내야합니다.',
  ),
  JsonFormatError: setExceptionCode(
    '8011',
    '올바른 JSON 형식으로 입력해주세요.',
  ),
};
