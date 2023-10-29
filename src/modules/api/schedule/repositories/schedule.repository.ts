import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';

@CustomRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> {
  async selectSchedulesOnSpecificDate(userId: number, date: string) {
    return await this.createQueryBuilder('S')
      .select('S.id', 'scheduleId')
      .addSelect('S.title', 'title')
      .addSelect('S.colorId', 'colorId')
      .addSelect('C.code', 'colorCode')
      .addSelect('SA.name', 'areaName')
      .addSelect('SA.time', 'areaTime')
      .innerJoin(ColorEntity, 'C', 'S.colorId = C.id')
      .leftJoin(
        (subQuery) =>
          subQuery
            .select('scheduleId')
            .addSelect('MIN(sequence)', 'sequence')
            .addSelect('name')
            .addSelect('time')
            .from(ScheduleAreaEntity, 'ScheduleArea')
            .groupBy('scheduleId'),
        'SA',
        'S.id = SA.scheduleId',
      )
      .where('S.userId = :userId', { userId })
      .andWhere(':date BETWEEN S.startDate AND S.endDate', { date })
      .orderBy('S.startDate')
      .addOrderBy('S.createdAt')
      .getRawMany();
  }
}
