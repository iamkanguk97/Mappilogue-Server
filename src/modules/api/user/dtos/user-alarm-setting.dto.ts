import { CheckColumnEnum } from 'src/constants/enum';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';

export class UserAlarmSettingDto {
  private readonly userId: number;
  private readonly isTotalAlarm: CheckColumnEnum;
  private readonly isNoticeAlarm: CheckColumnEnum;
  private readonly isMarketingAlarm: CheckColumnEnum;
  private readonly isScheduleReminderAlarm: CheckColumnEnum;

  private constructor(
    userId: number,
    isTotalAlarm: CheckColumnEnum,
    isNoticeAlarm: CheckColumnEnum,
    isMarketingAlarm: CheckColumnEnum,
    isScheduleReminderAlarm: CheckColumnEnum,
  ) {
    this.userId = userId;
    this.isTotalAlarm = isTotalAlarm;
    this.isNoticeAlarm = isNoticeAlarm;
    this.isMarketingAlarm = isMarketingAlarm;
    this.isScheduleReminderAlarm = isScheduleReminderAlarm;
  }

  static from(
    userId: number,
    userAlarmSettingEntity: UserAlarmSettingEntity,
  ): UserAlarmSettingDto {
    return new UserAlarmSettingDto(
      userId,
      userAlarmSettingEntity.isTotalAlarm,
      userAlarmSettingEntity.isNoticeAlarm,
      userAlarmSettingEntity.isMarketingAlarm,
      userAlarmSettingEntity.isScheduleReminderAlarm,
    );
  }

  get getIsTotalAlarm(): CheckColumnEnum {
    return this.isTotalAlarm;
  }

  get getIsScheduleReminderAlarm(): CheckColumnEnum {
    return this.isScheduleReminderAlarm;
  }
}
