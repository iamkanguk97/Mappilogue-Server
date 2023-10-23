import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';

@Entity('UserAlarmHistory')
export class UserAlarmHistoryEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('int')
  scheduleId: number;

  @Column('varchar', { length: 50 })
  title: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  body?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: 20,
  })
  alarmDate: string;

  @Column('varchar', { length: 20, nullable: true })
  type: string;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
    default: CheckColumnEnum.INACTIVE,
  })
  isRead: CheckColumnEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
    default: CheckColumnEnum.INACTIVE,
  })
  isSent: CheckColumnEnum;

  @Column('varchar', { nullable: true })
  alarmAt?: string | undefined;

  static from(
    userId: number,
    scheduleId: number,
    title: string,
    body: string,
    alarmDate: string,
    type: string,
  ): UserAlarmHistoryEntity {
    const userAlarmHistory = new UserAlarmHistoryEntity();

    userAlarmHistory.userId = userId;
    userAlarmHistory.scheduleId = scheduleId;
    userAlarmHistory.title = title;
    userAlarmHistory.body = body;
    userAlarmHistory.alarmDate = alarmDate;
    userAlarmHistory.type = type;

    return userAlarmHistory;
  }
}
