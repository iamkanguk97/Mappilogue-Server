import { PickType } from '@nestjs/mapped-types';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';
import { MarkCategoryEntity } from '../../entities/mark-category.entity';

export class PutMarkCategoryObject extends PickType(MarkCategoryEntity, [
  'id',
  'isMarkedInMap',
] as const) {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id!: number;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(MarkCategoryExceptionCode.IsMarkedInMapEmpty))
  isMarkedInMap!: CheckColumnEnum;

  toEntity(sequence: number): MarkCategoryEntity {
    const markCategory = new MarkCategoryEntity();

    markCategory.id = this.id;
    markCategory.isMarkedInMap = this.isMarkedInMap;
    markCategory.sequence = sequence;

    return markCategory;
  }
}

export class PutMarkCategoryRequestDto {
  @ValidateNested({ each: true })
  @Type(() => PutMarkCategoryObject)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  // @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.PutMarkCategoriesEmpty),
  )
  categories!: PutMarkCategoryObject[];
}
