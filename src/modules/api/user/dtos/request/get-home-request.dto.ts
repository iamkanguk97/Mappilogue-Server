import { IsEnum, IsNotEmpty } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { GetHomeOptionEnum } from '../../constants/enums/user-home.enum';

export class GetHomeRequestDto {
  @IsEnum(
    GetHomeOptionEnum,
    setValidatorContext(UserExceptionCode.GetHomeOptionErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.GetHomeOptionEmpty))
  option!: GetHomeOptionEnum;
}
