import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';

export class DeleteMarkCategoryRequestDto {
  @Type(() => Number)
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  id: number;
}
