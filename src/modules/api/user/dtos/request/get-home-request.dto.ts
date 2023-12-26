import { IsEnum, IsNotEmpty } from 'class-validator';
import { GetHomeOptionEnum } from '../../constants/user.enum';
import { setValidatorContext } from 'src/common/common';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

export class GetHomeRequestDto {
  @IsEnum(
    GetHomeOptionEnum,
    setValidatorContext(UserExceptionCode.GetHomeOptionErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.GetHomeOptionEmpty))
  option: GetHomeOptionEnum;
}
