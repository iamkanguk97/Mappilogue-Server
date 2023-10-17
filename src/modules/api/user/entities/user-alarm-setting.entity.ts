import { CHECK_COLUMN_LENGTH } from 'src/constants/constant';
import { CheckColumnEnum } from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('UserAlarmSetting')
export class UserAlarmSettingEntity extends DefaultColumnType {
  @Column('varchar', { length: CHECK_COLUMN_LENGTH })
  isTotalAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: CHECK_COLUMN_LENGTH,
  })
  isNoticeAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: CHECK_COLUMN_LENGTH,
  })
  isMarketingAlarm!: CheckColumnEnum;

  @Column('varchar', {
    length: CHECK_COLUMN_LENGTH,
  })
  isScheduleReminderAlarm!: CheckColumnEnum;

  @OneToOne(() => UserEntity, (user) => user.userAlarmSetting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
