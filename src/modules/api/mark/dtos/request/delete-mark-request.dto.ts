import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';

export class DeleteMarkRequestDto {
  @Type(() => Number)
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkIdEmpty))
  markId: number;
}
