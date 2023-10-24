import { IsOptional, IsString, Max } from 'class-validator';
import { USER_WITHDRAW_REASON_LENGTH } from '../constants/user.constant';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

export class PostUserWithdrawRequestDto {
  @Max(
    USER_WITHDRAW_REASON_LENGTH,
    setValidatorContext(UserExceptionCode.WithdrawReasonLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  reason?: string | undefined;
}
