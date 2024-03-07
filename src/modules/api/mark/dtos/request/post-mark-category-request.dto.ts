import { IsNotEmpty, IsString, Length } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { PickType } from '@nestjs/mapped-types';
import { MarkCategoryEntity } from '../../entities/mark-category.entity';
import { EMarkCategoryTitleLength } from '../../variables/enums/mark-category.enum';

export class PostMarkCategoryRequestDto extends PickType(MarkCategoryEntity, [
  'title',
] as const) {
  @Length(
    EMarkCategoryTitleLength.MIN,
    EMarkCategoryTitleLength.MAX,
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryTitleEmpty),
  )
  title!: string;

  toEntity(userId: number, sequence: number): MarkCategoryEntity {
    return MarkCategoryEntity.from(userId, this.title, sequence);
  }
}
