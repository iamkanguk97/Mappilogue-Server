import { CheckColumnEnum } from 'src/constants/enum';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { Exclude, Expose } from 'class-transformer';

export class UserAlarmSettingDto {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _isTotalAlarm: CheckColumnEnum;
  @Exclude() private readonly _isNoticeAlarm: CheckColumnEnum;
  @Exclude() private readonly _isMarketingAlarm: CheckColumnEnum;
  @Exclude() private readonly _isScheduleReminderAlarm: CheckColumnEnum;

  private constructor(
    userId: number,
    isTotalAlarm: CheckColumnEnum,
    isNoticeAlarm: CheckColumnEnum,
    isMarketingAlarm: CheckColumnEnum,
    isScheduleReminderAlarm: CheckColumnEnum,
  ) {
    this._userId = userId;
    this._isTotalAlarm = isTotalAlarm;
    this._isNoticeAlarm = isNoticeAlarm;
    this._isMarketingAlarm = isMarketingAlarm;
    this._isScheduleReminderAlarm = isScheduleReminderAlarm;
  }

  static of(
    userAlarmSettingEntity?: UserAlarmSettingEntity | undefined,
  ): UserAlarmSettingDto {
    return new UserAlarmSettingDto(
      userAlarmSettingEntity.userId,
      userAlarmSettingEntity.isTotalAlarm,
      userAlarmSettingEntity.isNoticeAlarm,
      userAlarmSettingEntity.isMarketingAlarm,
      userAlarmSettingEntity.isScheduleReminderAlarm,
    );
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  get isTotalAlarm(): CheckColumnEnum {
    return this._isTotalAlarm;
  }

  @Expose()
  get isNoticeAlarm(): CheckColumnEnum {
    return this._isNoticeAlarm;
  }

  @Expose()
  get isMarketingAlarm(): CheckColumnEnum {
    return this._isMarketingAlarm;
  }

  @Expose()
  get isScheduleReminderAlarm(): CheckColumnEnum {
    return this._isScheduleReminderAlarm;
  }
}
