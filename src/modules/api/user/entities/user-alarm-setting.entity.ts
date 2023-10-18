import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

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
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
