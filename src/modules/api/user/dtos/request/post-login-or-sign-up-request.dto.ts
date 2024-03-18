import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { EUserSnsType } from '../../variables/enums/user.enum';
import { ECheckColumn } from 'src/constants/enum';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { UserAlarmSettingEntity } from '../../entities/user-alarm-setting.entity';

export class PostLoginOrSignUpRequestDto {
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialAccessTokenEmpty))
  socialAccessToken!: string;

  @IsEnum(
    EUserSnsType,
    setValidatorContext(UserExceptionCode.SocialVendorErrorType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.SocialVendorEmpty))
  socialVendor!: EUserSnsType;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  fcmToken: string | null = null;

  @IsEnum(
    ECheckColumn,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsOptional()
  isAlarmAccept?: ECheckColumn = ECheckColumn.ACTIVE;

  /**
   * @summary UserAlarmSettingEntity 변환 함수
   * @author  Jason
   * @param   { number } userId
   * @returns { UserAlarmSettingEntity }
   */
  toUserAlarmSettingEntity(userId: number): UserAlarmSettingEntity {
    const value = this.isAlarmAccept ?? ECheckColumn.ACTIVE;

    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.userId = userId;
    userAlarmSetting.isTotalAlarm = value;
    userAlarmSetting.isNoticeAlarm = value;
    userAlarmSetting.isMarketingAlarm = value;
    userAlarmSetting.isScheduleReminderAlarm = value;

    return userAlarmSetting;
  }
}
