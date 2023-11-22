import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryRequestDto } from './mark-category-request.dto';

export class PutMarkCategoryRequestDto {
  @ValidateNested({ each: true })
  @Type(() => MarkCategoryRequestDto)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  // @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.PutMarkCategoriesEmpty),
  )
  categories: MarkCategoryRequestDto[];
}
