import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { REGEX_NICKNAME } from 'src/common/regex';

export class PatchUserNicknameRequestDto {
  @Matches(
    REGEX_NICKNAME,
    setValidatorContext(UserExceptionCode.NicknameFormatError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(UserExceptionCode.NicknameEmpty))
  nickname: string;
}
