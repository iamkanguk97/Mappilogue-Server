import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';

export class MarkCategoryRequestDto {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id: number;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(MarkCategoryExceptionCode.IsMarkedInMapEmpty))
  isMarkedInMap: CheckColumnEnum;
}
