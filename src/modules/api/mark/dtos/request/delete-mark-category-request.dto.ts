import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryEntity } from '../../entities/mark-category.entity';

export class DeleteMarkCategoryRequestDto extends PickType(MarkCategoryEntity, [
  'id',
] as const) {
  @Type(() => Number)
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id!: number;
}
