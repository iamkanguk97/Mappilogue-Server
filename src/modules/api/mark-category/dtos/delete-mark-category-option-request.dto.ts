import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeleteMarkCategoryOptionEnum } from '../constants/mark-category.enum';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';

export class DeleteMarkCategoryOptionRequestDto {
  @IsEnum(
    DeleteMarkCategoryOptionEnum,
    setValidatorContext(
      MarkCategoryExceptionCode.DeleteMarkCategoryOptionErrorType,
    ),
  )
  @IsNotEmpty(
    setValidatorContext(
      MarkCategoryExceptionCode.DeleteMarkCategoryOptionEmpty,
    ),
  )
  option: DeleteMarkCategoryOptionEnum;
}
