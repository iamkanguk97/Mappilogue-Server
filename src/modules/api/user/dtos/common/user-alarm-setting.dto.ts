import { ECheckColumn } from 'src/constants/enum';
import { UserAlarmSettingEntity } from '../../entities/user-alarm-setting.entity';
import { Exclude, Expose } from 'class-transformer';

export class UserAlarmSettingDto {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _isTotalAlarm: ECheckColumn;
  @Exclude() private readonly _isNoticeAlarm: ECheckColumn;
  @Exclude() private readonly _isMarketingAlarm: ECheckColumn;
  @Exclude() private readonly _isScheduleReminderAlarm: ECheckColumn;

  private constructor(
    userId: number,
    isTotalAlarm: ECheckColumn,
    isNoticeAlarm: ECheckColumn,
    isMarketingAlarm: ECheckColumn,
    isScheduleReminderAlarm: ECheckColumn,
  ) {
    this._userId = userId;
    this._isTotalAlarm = isTotalAlarm;
    this._isNoticeAlarm = isNoticeAlarm;
    this._isMarketingAlarm = isMarketingAlarm;
    this._isScheduleReminderAlarm = isScheduleReminderAlarm;
  }

  static of(
    userAlarmSettingEntity: UserAlarmSettingEntity,
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
  get isTotalAlarm(): ECheckColumn {
    return this._isTotalAlarm;
  }

  @Expose()
  get isNoticeAlarm(): ECheckColumn {
    return this._isNoticeAlarm;
  }

  @Expose()
  get isMarketingAlarm(): ECheckColumn {
    return this._isMarketingAlarm;
  }

  @Expose()
  get isScheduleReminderAlarm(): ECheckColumn {
    return this._isScheduleReminderAlarm;
  }
}
