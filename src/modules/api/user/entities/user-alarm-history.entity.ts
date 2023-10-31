import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';
import {
  USER_ALARM_HISTORY_BODY_LENGTH,
  USER_ALARM_HISTORY_DATE_LENGTH,
  USER_ALARM_HISTORY_TITLE_LENGTH,
  USER_ALARM_HISTORY_TYPE_LENGTH,
} from '../constants/user.constant';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';

@Entity('UserAlarmHistory')
export class UserAlarmHistoryEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('int')
  scheduleId: number;

  @Column('varchar', { length: USER_ALARM_HISTORY_TITLE_LENGTH })
  title: string;

  @Column('varchar', {
    length: USER_ALARM_HISTORY_BODY_LENGTH,
    nullable: true,
  })
  body?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: USER_ALARM_HISTORY_DATE_LENGTH,
  })
  alarmDate: string;

  @Column('varchar', { length: USER_ALARM_HISTORY_TYPE_LENGTH, nullable: true })
  type: NotificationTypeEnum;

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
    type: NotificationTypeEnum,
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
