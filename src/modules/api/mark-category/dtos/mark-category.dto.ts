import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';

export class MarkCategoryDto {
  /**
   * @comment 마크 카테고리 수정을 위해 Class-Validator decorator 적용
   */

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id: number;

  @IsOptional()
  title: string;

  @IsOptional()
  sequence: number;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(MarkCategoryExceptionCode.IsMarkedInMapEmpty))
  isMarkedInMap: CheckColumnEnum;

  constructor(
    id: number,
    title: string,
    sequence: number,
    isMarkedInMap: CheckColumnEnum,
  ) {
    this.id = id;
    this.title = title;
    this.sequence = sequence;
    this.isMarkedInMap = isMarkedInMap;
  }
}
