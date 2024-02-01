import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { UserSnsTypeEnum } from '../constants/user.enum';
import { CheckColumnEnum } from 'src/constants/enum';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { UserSocialFactory } from '../factories/user-social.factory';
import { TSocialFactory } from 'src/modules/core/auth/types';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';

export class PostLoginOrSignUpRequestDto {
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialAccessTokenEmpty))
  socialAccessToken!: string;

  @IsEnum(
    UserSnsTypeEnum,
    setValidatorContext(UserExceptionCode.SocialVendorErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialVendorEmpty))
  socialVendor!: UserSnsTypeEnum;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  fcmToken?: string | null = null;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: CheckColumnEnum = CheckColumnEnum.ACTIVE;

  /**
   * @summary 사용자 소셜 구분 후 Factory 생성
   * @author  Jason
   * @returns { TSocialFactory }
   */
  buildSocialFactory(): TSocialFactory {
    return UserSocialFactory.from(
      this.socialVendor,
      this.socialAccessToken,
    ).setSocialFactory();
  }

  /**
   * @summary UserAlarmSettingEntity 변환 함수
   * @author  Jason
   * @param   { number } userId
   * @returns { UserAlarmSettingEntity }
   */
  toUserAlarmSettingEntity(userId: number): UserAlarmSettingEntity {
    const value = this.isAlarmAccept ?? CheckColumnEnum.ACTIVE;

    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.userId = userId;
    userAlarmSetting.isTotalAlarm = value;
    userAlarmSetting.isNoticeAlarm = value;
    userAlarmSetting.isMarketingAlarm = value;
    userAlarmSetting.isScheduleReminderAlarm = value;

    return userAlarmSetting;
  }
}
