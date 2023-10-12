import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonException, UserException } from 'src/common/error-code';
import { CheckColumnInArray } from 'src/constants';
import { CheckColumnType } from 'src/types/type';
import { UserSnsTypeEnum } from '../constants/user.enum';

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
  fcmToken?: string | null;

  @IsIn(
    CheckColumnInArray,
    setValidatorContext(CommonException.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: CheckColumnType | null;
}
