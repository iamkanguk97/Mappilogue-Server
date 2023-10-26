import { setValidatorContext } from 'src/common/common';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryTitleLengthEnum } from '../constants/mark-category.enum';

export class PatchMarkCategoryTitleRequestDto {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  markCategoryId: number;

  @Length(
    MarkCategoryTitleLengthEnum.MIN,
    MarkCategoryTitleLengthEnum.MAX,
    MarkCategoryExceptionCode.MarkCategoryTitleLengthError,
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleEmpty),
  )
  title: string;
}
