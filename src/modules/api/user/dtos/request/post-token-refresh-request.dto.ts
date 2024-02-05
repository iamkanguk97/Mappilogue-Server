import { IsNotEmpty, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

export class PostTokenRefreshRequestDto {
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(UserExceptionCode.RefreshTokenEmpty))
  refreshToken!: string;
}
