import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { UserAlarmHistoryEntity } from '../entities/user-alarm-history.entity';
import { Repository } from 'typeorm';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';
import { UserEntity } from '../entities/user.entity';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';

@CustomRepository(UserAlarmHistoryEntity)
export class UserAlarmHistoryRepository extends Repository<UserAlarmHistoryEntity> {
  async selectUserScheduleAlarms(
    userId: number,
    scheduleId: number,
  ): Promise<UserAlarmHistoryEntity[]> {
    return await this.createQueryBuilder('UAH')
      // .select('DATE_FORMAT(UAH.alarmDate, "%c월 %e일 %l:%i %p")', 'alarmDate')
      // .select('DATE_FORMAT(UAH.alarmDate, "%Y-%m-%d")', 'alarmDate')
      .select('UAH.alarmDate', 'alarmDate')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('id')
            .from(UserEntity, 'U')
            .where('U.id = :userId', { userId })
            .andWhere('U.deletedAt IS NULL'),
        'U',
        'U.id = UAH.userId',
      )
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('id')
            .from(ScheduleEntity, 'S')
            .where('S.id = :scheduleId', { scheduleId })
            .andWhere('S.deletedAt IS NULL'),
        'S',
        'S.id = UAH.scheduleId',
      )
      .where('UAH.type = :type', {
        type: NotificationTypeEnum.SCHEDULE_REMINDER,
      })
      .andWhere('UAH.deletedAt IS NULL')
      .orderBy('UAH.alarmDate')
      .getRawMany();
  }
}
