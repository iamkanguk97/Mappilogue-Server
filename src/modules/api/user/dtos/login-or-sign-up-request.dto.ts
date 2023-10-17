import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { UserSnsTypeEnum } from '../constants/user.enum';
import { CheckColumnEnum } from 'src/constants/enum';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

export class LoginOrSignUpRequestDto {
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialAccessTokenEmpty))
  socialAccessToken: string;

  @IsEnum(
    UserSnsTypeEnum,
    setValidatorContext(UserExceptionCode.SocialVendorErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialVendorEmpty))
  socialVendor: UserSnsTypeEnum;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  fcmToken?: string | undefined;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: CheckColumnEnum | undefined;
}
