import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonException, UserException } from 'src/common/error-code';
import { UserSnsTypeEnum } from '../constants/user.enum';
import { CheckColumnEnum } from 'src/constants/enum';

export class LoginOrSignUpRequestDto {
  @IsString(setValidatorContext(CommonException.MustStringType))
  @IsNotEmpty(setValidatorContext(UserException.SocialAccessTokenEmpty))
  socialAccessToken: string;

  @IsEnum(
    UserSnsTypeEnum,
    setValidatorContext(UserException.SocialVendorErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserException.SocialVendorEmpty))
  socialVendor: UserSnsTypeEnum;

  @IsString(setValidatorContext(CommonException.MustStringType))
  fcmToken?: string | undefined;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonException.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: CheckColumnEnum | undefined;
}
