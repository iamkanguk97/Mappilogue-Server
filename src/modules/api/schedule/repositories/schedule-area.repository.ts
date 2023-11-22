import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entities/schedule.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import { IScheduleAreasById } from '../types';

@CustomRepository(ScheduleAreaEntity)
export class ScheduleAreaRepository extends Repository<ScheduleAreaEntity> {
  async selectScheduleAreasById(
    scheduleId: number,
  ): Promise<IScheduleAreasById[]> {
    return await this.createQueryBuilder('SA')
      .select([
        'SA.id AS scheduleAreaId',
        'SA.scheduleId AS scheduleId',
        'SA.date AS date',
        'SA.name AS name',
        'IFNULL(SA.streetAddress, "") AS streetAddress',
        'IFNULL(SA.latitude, "") AS latitude',
        'IFNULL(SA.longitude, "") AS longitude',
        'IFNULL(SA.time, "") AS time',
        'SA.sequence AS sequence',
      ])
      .innerJoin(ScheduleEntity, 'S', 'S.id = SA.scheduleId')
      .where('SA.scheduleId = :scheduleId', { scheduleId })
      .andWhere('SA.status = :status', { status: StatusColumnEnum.ACTIVE })
      .andWhere('S.status = :status', { status: StatusColumnEnum.ACTIVE })
      .orderBy('SA.date')
      .addOrderBy('SA.sequence')
      .getRawMany();
  }
}
