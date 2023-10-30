import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import { getLastDate } from 'src/helpers/date.helper';
import { ISchedulesInCalender, ISchedulesOnSpecificDate } from '../types';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { StatusColumnEnum } from 'src/constants/enum';

@CustomRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> {
  async selectSchedulesOnSpecificDate(
    userId: number,
    date: string,
  ): Promise<ISchedulesOnSpecificDate[]> {
    return await this.createQueryBuilder('S')
      .select([
        'S.id AS scheduleId',
        'S.title AS title',
        'S.colorId AS colorId',
        'C.code AS colorCode',
        'IFNULL(SA.name, "") AS areaName',
        'IFNULL(SA.time, "") AS areaTime',
      ])
      .innerJoin(ColorEntity, 'C', 'S.colorId = C.id')
      .leftJoin(ScheduleAreaEntity, 'SA', 'SA.scheduleId = S.id')
      .where('S.userId = :userId', { userId })
      .andWhere(':date BETWEEN S.startDate AND S.endDate', { date })
      .andWhere('S.status = :status', { status: StatusColumnEnum.ACTIVE })
      .andWhere('IF(SA.sequence IS NOT NULL, SA.status = :status, true)', {
        status: StatusColumnEnum.ACTIVE,
      })
      .groupBy('SA.scheduleId')
      .orderBy('S.startDate, S.createdAt')
      .getRawMany();
  }

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
