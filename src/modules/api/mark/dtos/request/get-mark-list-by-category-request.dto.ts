import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';

export class GetMarkListByCategoryRequestDto extends PageOptionsDto {
  @Type(() => Number)
  @IsInt(setValidatorContext(CommonExceptionCode.MustIntegerType))
  @IsNotEmpty(
    setValidatorContext(MarkCategoryExceptionCode.MarkCategoryIdEmpty),
  )
  markCategoryId: number;
}
