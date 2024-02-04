import { IsEnum, IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { DeleteMarkCategoryOptionEnum } from '../../constants/enums/mark-category.enum';

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
  option!: DeleteMarkCategoryOptionEnum;
}
