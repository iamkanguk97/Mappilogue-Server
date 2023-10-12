import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonException, UserException } from 'src/common/error-code';
import { CheckColumnInArray } from 'src/constants';
import { CheckColumnType } from 'src/types/type';

export class LoginOrSignUpRequestDto {
  @IsString(setValidatorContext(CommonException.MustStringType))
  @IsNotEmpty(setValidatorContext(UserException.SocialAccessTokenEmpty))
  socialAccessToken: string;

  @IsIn(
    ['KAKAO', 'APPLE'],
    setValidatorContext(UserException.SocialVendorErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserException.SocialVendorEmpty))
  socialVendor: string;

  @IsString(setValidatorContext(CommonException.MustStringType))
  fcmToken?: string | null;

  @IsIn(
    CheckColumnInArray,
    setValidatorContext(CommonException.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: CheckColumnType | null;
}
