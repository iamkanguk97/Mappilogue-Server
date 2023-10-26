import { IsNotEmpty, IsString, Length } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryTitleLengthEnum } from '../constants/mark-category.enum';

export class PostMarkCategoryRequestDto {
  @Length(
    MarkCategoryTitleLengthEnum.MIN,
    MarkCategoryTitleLengthEnum.MAX,
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleEmpty),
  )
  title: string;
}
