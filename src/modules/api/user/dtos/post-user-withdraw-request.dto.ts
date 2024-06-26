import { IsOptional, IsString, Length } from 'class-validator';
import { USER_WITHDRAW_REASON_LENGTH } from '../constants/user.constant';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { DecodedUserToken } from '../types';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';

export class PostUserWithdrawRequestDto {
  @Length(
    0,
    USER_WITHDRAW_REASON_LENGTH,
    setValidatorContext(UserExceptionCode.WithdrawReasonLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  reason?: string | undefined;

  toEntity(user: DecodedUserToken): UserWithdrawReasonEntity {
    return UserWithdrawReasonEntity.from(user.id, user.email, this.reason);
  }
}
