import { DefaultPaginationEnum } from 'src/constants/enum';
import { isDefined, isNumeric } from './common.helper';
import { BadRequestException } from '@nestjs/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

/**
 * @summary 페이지 번호 결정함수
 * @author  Jason
 * @param   { number | string | undefined } pageNo
 * @returns { number }
 */
export function setPageNo(pageNo?: number | string | undefined): number {
  if (typeof pageNo === 'string' && !isNumeric(pageNo)) {
    throw new BadRequestException(CommonExceptionCode.PageNumberMustNumberType);
  }

  return !isDefined(pageNo) || Number(pageNo) < 1
    ? DefaultPaginationEnum.DEFAULT_PAGE_NO
    : Number(pageNo);
}

/**
 * @summary 페이지 사이즈 결정함수
 * @author  Jason
 * @param   { number | string | undefined } pageSize
 * @returns { number }
 */
export function setPageSize(pageSize?: number | string | undefined): number {
  if (typeof pageSize === 'string' && !isNumeric(pageSize)) {
    throw new BadRequestException(CommonExceptionCode.PageNumberMustNumberType);
  }

  return !isDefined(pageSize) || Number(pageSize) < 1
    ? DefaultPaginationEnum.DEFAULT_PAGE_SIZE
    : Number(pageSize);
}
