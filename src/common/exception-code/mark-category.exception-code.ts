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
};
