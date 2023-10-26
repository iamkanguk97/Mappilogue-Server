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
};
