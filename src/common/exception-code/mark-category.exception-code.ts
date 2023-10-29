import { setExceptionCode } from '../common';

export const MarkCategoryExceptionCode = {
  MarkCategoryTitleEmpty: setExceptionCode(
    '4001',
    '기록 카테고리 이름을 입력해주세요.',
  ),
  MarkCategoryTitleLengthError: setExceptionCode(
    '4002',
    '기록 카테고리 이름은 최대 50자까지 등록 가능합니다.',
  ),
  MarkCategoryNotExist: setExceptionCode(
    '4003',
    '존재하지 않는 기록 카테고리입니다.',
  ),
  MarkCategoryNotMine: setExceptionCode(
    '4004',
    '본인의 기록 카테고리가 아닙니다.',
  ),
  MarkCategoryIdEmpty: setExceptionCode(
    '4005',
    '기록 카테고리 아이디를 입력해주세요.',
  ),
  PutMarkCategoriesEmpty: setExceptionCode(
    '4006',
    '기록 카테고리를 수정하려면 categories property를 입력해주세요.',
  ),
  IsMarkedInMapEmpty: setExceptionCode(
    '4007',
    '지도에 표시할 기록 카테고리에 대한 값을 입력해주세요.',
  ),
  MarkCategoryNotEqualWithModel: setExceptionCode(
    '4008',
    '기록 카테고리 수정시에는 화면에 출력되는 데이터를 모두 입력해주셔야 합니다.',
  ),
  DeleteMarkCategoryOptionEmpty: setExceptionCode(
    '4009',
    '기록 카테고리 삭제 옵션을 입력해주세요.',
  ),
  DeleteMarkCategoryOptionErrorType: setExceptionCode(
    '4010',
    '기록 카테고리 삭제 옵션은 ALL 또는 ONLY로 입력 가능합니다.',
  ),
};
