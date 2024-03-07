import { IsEnum, IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { EDeleteMarkCategoryOption } from '../../variables/enums/mark-category.enum';

export class DeleteMarkCategoryOptionRequestDto {
  @IsEnum(
    EDeleteMarkCategoryOption,
    setValidatorContext(
      MarkCategoryExceptionCode.DeleteMarkCategoryOptionErrorType,
    ),
  )
  @IsNotEmpty(
    setValidatorContext(
      MarkCategoryExceptionCode.DeleteMarkCategoryOptionEmpty,
    ),
  )
  option!: EDeleteMarkCategoryOption;
}
