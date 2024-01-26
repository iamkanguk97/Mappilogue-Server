import { IsEnum, IsNotEmpty } from 'class-validator';
import { CheckColumnEnum } from 'src/constants/enum';
import { UserAlarmSettingEntity } from '../../entities/user-alarm-setting.entity';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { PickType } from '@nestjs/mapped-types';

export class PutUserAlarmSettingRequestDto extends PickType(
  UserAlarmSettingEntity,
  [
    'isTotalAlarm',
    'isScheduleReminderAlarm',
    'isNoticeAlarm',
    'isMarketingAlarm',
  ] as const,
) {
  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsTotalAlarmEmpty))
  isTotalAlarm!: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsNoticeAlarmEmpty))
  isNoticeAlarm!: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(setValidatorContext(UserExceptionCode.IsMarketingAlarmEmpty))
  isMarketingAlarm!: CheckColumnEnum;

  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(
    setValidatorContext(UserExceptionCode.IsScheduleReminderAlarmEmpty),
  )
  isScheduleReminderAlarm!: CheckColumnEnum;

  toEntity(): UserAlarmSettingEntity {
    return UserAlarmSettingEntity.from(
      this.isTotalAlarm,
      this.isNoticeAlarm,
      this.isMarketingAlarm,
      this.isScheduleReminderAlarm,
    );
  }
}
