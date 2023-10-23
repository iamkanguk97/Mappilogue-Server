import { CheckColumnEnum } from 'src/constants/enum';

export class UserAlarmSettingDto {
  private readonly userId: number;
  private readonly isTotalAlarm: CheckColumnEnum;
  private readonly isNoticeAlarm: CheckColumnEnum;
  private readonly isMarketingAlarm: CheckColumnEnum;
  private readonly isScheduleReminderAlarm: CheckColumnEnum;

  constructor(
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

  get getIsTotalAlarm(): CheckColumnEnum {
    return this.isTotalAlarm;
  }

  get getIsScheduleReminderAlarm(): CheckColumnEnum {
    return this.isScheduleReminderAlarm;
  }
}
