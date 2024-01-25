import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { setPageNo, setPageSize } from 'src/helpers/paginate.helper';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt(setValidatorContext(CommonExceptionCode.MustIntegerType))
  @IsOptional()
  pageNo?: number;

  @Type(() => Number)
  @IsInt(setValidatorContext(CommonExceptionCode.MustIntegerType))
  @IsOptional()
  pageSize?: number;

  constructor(pageNo: number, pageSize: number) {
    this.pageNo = pageNo;
    this.pageSize = pageSize;
  }

  /**
   * @summary offset을 구하는 함수
   * @author  Jason
   * @returns { number }
   */
  getOffset(): number {
    this.pageNo = setPageNo(this?.pageNo);
    this.pageSize = setPageSize(this?.pageSize);
    return (Number(this.pageNo) - 1) * Number(this.pageSize);
  }

  /**
   * @summary limit을 구하는 함수
   * @author  Jason
   * @returns { number }
   */
  getLimit(): number {
    this.pageSize = setPageSize(this?.pageSize);
    return Number(this.pageSize);
  }
}
