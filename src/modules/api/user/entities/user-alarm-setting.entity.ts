import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';

@Entity('UserAlarmSetting')
export class UserAlarmSettingEntity extends DefaultColumnType {
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
  user: UserEntity;

  static from(isAlarmAccept: CheckColumnEnum): UserAlarmSettingEntity {
    const userAlarmSetting = new UserAlarmSettingEntity();

    userAlarmSetting.isTotalAlarm = isAlarmAccept;
    userAlarmSetting.isNoticeAlarm = isAlarmAccept;
    userAlarmSetting.isMarketingAlarm = isAlarmAccept;
    userAlarmSetting.isScheduleReminderAlarm = isAlarmAccept;

    return userAlarmSetting;
  }

  static toDto(
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
}
