import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import { getLastDate } from 'src/helpers/date.helper';
import { ISchedulesInCalender } from '../types';

@CustomRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> {
  async selectSchedulesInCalender(
    userId: number,
    year: number,
    month: number,
  ): Promise<ISchedulesInCalender[]> {
    return await this.createQueryBuilder('S')
      .select([
        'S.id AS scheduleId',
        'S.userId AS userId',
        'S.colorId AS colorId',
        'DATE_FORMAT(S.startDate, "%Y-%m-%d") AS startDate',
        'DATE_FORMAT(S.endDate, "%Y-%m-%d") AS endDate',
        'S.title AS title',
        'C.code AS colorCode',
      ])
      .innerJoin(ColorEntity, 'C', 'S.colorId = C.id')
      .where('S.userId = :userId', { userId })
      .andWhere(`S.startDate <= "${year}-${month}-${getLastDate(year, month)}"`)
      .andWhere(`S.endDate >= "${year}-${month}-01"`)
      .andWhere('S.status = :status', { status: 'ACTIVE' })
      .orderBy('S.startDate')
      .addOrderBy('S.createdAt')
      .getRawMany();
  }
}
