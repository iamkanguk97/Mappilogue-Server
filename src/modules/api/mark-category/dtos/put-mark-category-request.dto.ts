import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { MarkCategoryDto } from './mark-category.dto';
import { Type } from 'class-transformer';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

export class PutMarkCategoryRequestDto {
  @ValidateNested({ each: true })
  @Type(() => MarkCategoryDto)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.PutMarkCategoriesEmpty),
  )
  categories: MarkCategoryDto[];
}
