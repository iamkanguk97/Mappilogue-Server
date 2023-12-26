import { DefaultPaginationEnum } from 'src/constants/enum';
import { isDefined } from './common.helper';

/**
 * @summary 페이지 번호 결정함수
 * @author  Jason
 * @param   { number } pageNo
 * @returns { number | undefined }
 */
export function setPageNo(pageNo?: number | undefined): number {
  return !isDefined(pageNo) || pageNo
    ? DefaultPaginationEnum.DEFAULT_PAGE_NO
    : Number(pageNo);
}

/**
 * @summary 페이지 사이즈 결정함수
 * @author  Jason
 * @param   { number | undefined } pageSize
 * @returns { number }
 */
export function setPageSize(pageSize?: number | undefined): number {
  return !isDefined(pageSize) || pageSize < 1
    ? DefaultPaginationEnum.DEFAULT_PAGE_SIZE
    : Number(pageSize);
}
