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
  MarkMetadataIsMainImageEmpty: setExceptionCode(
    '5007',
    '대표 이미지 여부를 입력해주세요.',
  ),
  MarkMainImageMustOne: setExceptionCode(
    '5008',
    '대표 이미지는 필수로 1개 설정해야 합니다.',
  ),
  MarkMetadataLengthError: setExceptionCode(
    '5009',
    'MarkMetadata의 배열 길이는 업로드하신 사진의 개수와 동일해야 합니다.',
  ),
  MarkContentNotExistWhenMetadatIsExist: setExceptionCode(
    '5010',
    'markMetadata를 입력하셨을땐 content를 입력할 수 없습니다.',
  ),
};
