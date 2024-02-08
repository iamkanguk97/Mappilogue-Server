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
import { Notification } from 'firebase-admin/lib/messaging/messaging-api';

@Entity('UserAlarmHistory')
export class UserAlarmHistoryEntity extends DefaultColumnType {
  @Column('int')
  userId!: number;

  @Column('int')
  scheduleId!: number;

  @Column('varchar', {
    length: USER_ALARM_HISTORY_TITLE_LENGTH,
  })
  title!: string;

  @Column('varchar', {
    length: USER_ALARM_HISTORY_BODY_LENGTH,
    nullable: true,
  })
  body!: string | null;

  @Column('varchar', {
    nullable: true,
    length: USER_ALARM_HISTORY_DATE_LENGTH,
  })
  alarmDate!: string | null;

  @Column('varchar', { length: USER_ALARM_HISTORY_TYPE_LENGTH, nullable: true })
  type!: NotificationTypeEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
    default: CheckColumnEnum.INACTIVE,
  })
  isRead!: CheckColumnEnum;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
    default: CheckColumnEnum.INACTIVE,
  })
  isSent!: CheckColumnEnum;

  @Column('varchar', { nullable: true })
  alarmAt!: string | null;

  static from(
    userId: number,
    scheduleId: number,
    notification: Notification,
    alarmDate: string,
    type: NotificationTypeEnum,
  ): UserAlarmHistoryEntity {
    const userAlarmHistory = new UserAlarmHistoryEntity();

    userAlarmHistory.userId = userId;
    userAlarmHistory.scheduleId = scheduleId;
    userAlarmHistory.title = notification.title ?? '';
    userAlarmHistory.body = notification.body ?? null;
    userAlarmHistory.alarmDate = alarmDate;
    userAlarmHistory.type = type;

    return userAlarmHistory;
  }
}
