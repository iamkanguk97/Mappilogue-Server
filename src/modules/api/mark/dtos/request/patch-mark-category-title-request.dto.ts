import { setValidatorContext } from 'src/common/common';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryEntity } from '../../entities/mark-category.entity';
import { MarkCategoryTitleLengthEnum } from '../../constants/enums/mark-category.enum';
import { PickType } from '@nestjs/mapped-types';

export class PatchMarkCategoryTitleRequestDto extends PickType(
  MarkCategoryEntity,
  ['id', 'title'] as const,
) {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id!: number;

  @Length(
    MarkCategoryTitleLengthEnum.MIN,
    MarkCategoryTitleLengthEnum.MAX,
    MarkCategoryExceptionCode.MarkCategoryTitleLengthError,
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleEmpty),
  )
  title!: string;

  toEntity(): MarkCategoryEntity {
    const markCategory = new MarkCategoryEntity();

    markCategory.id = this.id;
    markCategory.title = this.title;

    return markCategory;
  }
}
