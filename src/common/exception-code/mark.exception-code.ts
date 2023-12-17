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
  MainScheduleAreaIdAndMainLocationBothInclude: setExceptionCode(
    '5011',
    'mainScheduleAreaId와 mainLocation을 같이 입력하실 수 없습니다.',
  ),
  MarkLocationNameEmpty: setExceptionCode(
    '5012',
    '기록 대표위치 이름을 입력해주세요.',
  ),
  MarkLocationNameLengthError: setExceptionCode(
    '5013',
    '기록 대표위치 이름은 최대 30자까지 입력 가능합니다.',
  ),
  MarkLocationStreetAddressLengthError: setExceptionCode(
    '5014',
    '기록 대표위치 도로명주소는 최대 100자까지 입력 가능합니다.',
  ),
  MarkLocationLatitudeLengthError: setExceptionCode(
    '5015',
    '기록 대표위치 위도는 최대 100자까지 입력 가능합니다.',
  ),
  MarkLocationLongitudeLengthError: setExceptionCode(
    '5016',
    '기록 대표위치 경도는 최대 100자까지 입력 가능합니다.',
  ),
  MustScheduleIdExistWhenScheduleAreaIdExist: setExceptionCode(
    '5017',
    'mainScheduleAreaId가 있으면 scheduleId를 필수로 입력해주셔야 합니다.',
  ),
  MarkContentAndMetadataEmpty: setExceptionCode(
    '5018',
    '기록의 내용이 입력된 것이 없습니다. 내용 또는 사진을 입력해주세요.',
  ),
  MainScheduleAreaIdAndMainLocationBothNotInclude: setExceptionCode(
    '5019',
    'mainScheduleAreaId와 mainLocation 둘 중 하나의 값은 입력하셔야 합니다.',
  ),
};
