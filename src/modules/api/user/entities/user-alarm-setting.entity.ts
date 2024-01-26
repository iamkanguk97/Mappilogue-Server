import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('UserAlarmSetting')
export class UserAlarmSettingEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('varchar', { length: StatusOrCheckColumnLengthEnum.CHECK })
  isTotalAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
  })
  isNoticeAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
  })
  isMarketingAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
  })
  isScheduleReminderAlarm!: CheckColumnEnum;

  @OneToOne(() => UserEntity, (user) => user.userAlarmSetting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  static from(
    isTotalAlarm: CheckColumnEnum,
    isNoticeAlarm: CheckColumnEnum,
    isMarketingAlarm: CheckColumnEnum,
    isScheduleReminderAlarm: CheckColumnEnum,
  ): UserAlarmSettingEntity {
    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.isTotalAlarm = isTotalAlarm;
    userAlarmSetting.isNoticeAlarm = isNoticeAlarm;
    userAlarmSetting.isMarketingAlarm = isMarketingAlarm;
    userAlarmSetting.isScheduleReminderAlarm = isScheduleReminderAlarm;

    return userAlarmSetting;
  }

  static fromValue(userId: number, isAlarmAccept: CheckColumnEnum) {
    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.userId = userId;
    userAlarmSetting.isTotalAlarm = isAlarmAccept;
    userAlarmSetting.isNoticeAlarm = isAlarmAccept;
    userAlarmSetting.isMarketingAlarm = isAlarmAccept;
    userAlarmSetting.isScheduleReminderAlarm = isAlarmAccept;

    return userAlarmSetting;
  }
}
