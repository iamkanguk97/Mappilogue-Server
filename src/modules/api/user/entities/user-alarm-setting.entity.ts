import { ECheckColumn, EStatusOrCheckColumnLength } from 'src/constants/enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('UserAlarmSetting')
export class UserAlarmSettingEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('varchar', { length: EStatusOrCheckColumnLength.CHECK })
  isTotalAlarm!: ECheckColumn;

  @Column('varchar', {
    length: EStatusOrCheckColumnLength.CHECK,
  })
  isNoticeAlarm!: ECheckColumn;

  @Column('varchar', {
    length: EStatusOrCheckColumnLength.CHECK,
  })
  isMarketingAlarm!: ECheckColumn;

  @Column('varchar', {
    length: EStatusOrCheckColumnLength.CHECK,
  })
  isScheduleReminderAlarm!: ECheckColumn;

  @OneToOne(() => UserEntity, (user) => user.userAlarmSetting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  static from(
    isTotalAlarm: ECheckColumn,
    isNoticeAlarm: ECheckColumn,
    isMarketingAlarm: ECheckColumn,
    isScheduleReminderAlarm: ECheckColumn,
  ): UserAlarmSettingEntity {
    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.isTotalAlarm = isTotalAlarm;
    userAlarmSetting.isNoticeAlarm = isNoticeAlarm;
    userAlarmSetting.isMarketingAlarm = isMarketingAlarm;
    userAlarmSetting.isScheduleReminderAlarm = isScheduleReminderAlarm;

    return userAlarmSetting;
  }
}
