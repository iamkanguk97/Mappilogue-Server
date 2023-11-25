import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entities/schedule.entity';
import { IScheduleAreasById } from '../types';
import { MarkLocationEntity } from '../../mark/entities/mark-location.entity';
import { CheckColumnEnum } from 'src/constants/enum';

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
        `IF(ML.scheduleAreaId IS NULL, "${CheckColumnEnum.INACTIVE}", "${CheckColumnEnum.ACTIVE}") AS isRepLocation`,
      ])
      .innerJoin(ScheduleEntity, 'S', 'S.id = SA.scheduleId')
      .leftJoin(MarkLocationEntity, 'ML', 'SA.id = ML.scheduleAreaId')
      .where('SA.scheduleId = :scheduleId', { scheduleId })
      .andWhere('SA.deletedAt IS NULL')
      .andWhere('S.deletedAt IS NULL')
      .andWhere('ML.deletedAt IS NULL')
      .orderBy('SA.date')
      .addOrderBy('SA.sequence')
      .getRawMany();
  }
}
