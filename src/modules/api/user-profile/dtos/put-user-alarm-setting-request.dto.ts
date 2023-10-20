import { IsEnum, IsNotEmpty } from 'class-validator';
import { CheckColumnEnum } from 'src/constants/enum';
import { UserAlarmSettingEntity } from '../../user/entities/user-alarm-setting.entity';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

export class PutUserAlarmSettingRequestDto {
  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsTotalAlarmEmpty))
  isTotalAlarm: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsNoticeAlarmEmpty))
  isNoticeAlarm: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsMarketingAlarmEmpty))
  isMarketingAlarm: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(
    setValidatorContext(UserExceptionCode.IsScheduleReminderAlarmEmpty),
  )
  isScheduleReminderAlarm: CheckColumnEnum;

  static toEntity(body: PutUserAlarmSettingRequestDto): UserAlarmSettingEntity {
    const userAlarmSettingEntity = new UserAlarmSettingEntity();

    userAlarmSettingEntity.isTotalAlarm = body.isTotalAlarm;
    userAlarmSettingEntity.isNoticeAlarm = body.isNoticeAlarm;
    userAlarmSettingEntity.isMarketingAlarm = body.isMarketingAlarm;
    userAlarmSettingEntity.isScheduleReminderAlarm =
      body.isScheduleReminderAlarm;

    return userAlarmSettingEntity;
  }
}
