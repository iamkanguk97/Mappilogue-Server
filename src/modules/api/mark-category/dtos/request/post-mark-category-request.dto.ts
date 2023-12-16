import { IsNotEmpty, IsString, Length } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryTitleLengthEnum } from '../../constants/mark-category.enum';
import { PickType } from '@nestjs/mapped-types';
import { MarkCategoryEntity } from '../../../mark/entities/mark-category.entity';

export class PostMarkCategoryRequestDto extends PickType(MarkCategoryEntity, [
  'title',
] as const) {
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
