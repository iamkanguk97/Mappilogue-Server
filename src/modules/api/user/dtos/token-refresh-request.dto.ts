import { IsNotEmpty, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonException, UserException } from 'src/common/error-code';

export class TokenRefreshRequestDto {
  @IsString(setValidatorContext(CommonException.MustStringType))
  @IsNotEmpty(setValidatorContext(UserException.RefreshTokenEmpty))
  refreshToken: string;
}
