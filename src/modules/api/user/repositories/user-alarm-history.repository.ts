import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserAlarmHistoryEntity } from '../entities/user-alarm-history.entity';
import { Repository } from 'typeorm';
import { StatusColumnEnum } from 'src/constants/enum';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';

@CustomRepository(UserAlarmHistoryEntity)
export class UserAlarmHistoryRepository extends Repository<UserAlarmHistoryEntity> {
  async selectUserScheduleAlarms(
    userId: number,
    scheduleId: number,
  ): Promise<UserAlarmHistoryEntity[]> {
    return await this.createQueryBuilder('A')
      .select('DATE_FORMAT(A.alarmDate, "%c월 %e일 %l:%i %p")', 'alarmDate')
      .where('A.scheduleId = :scheduleId', { scheduleId })
      .andWhere('A.userId = :userId', { userId })
      .andWhere('A.status = :status', { status: StatusColumnEnum.ACTIVE })
      .andWhere('A.type = :type', {
        type: NotificationTypeEnum.SCHEDULE_REMINDER,
      })
      .orderBy('A.alarmDate')
      .getRawMany();
  }
}
