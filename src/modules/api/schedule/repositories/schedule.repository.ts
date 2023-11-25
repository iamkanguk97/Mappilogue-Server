import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import { ISchedulesInCalendar, ISchedulesOnSpecificDate } from '../types';
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
        'DATE_FORMAT(S.startDate, "%Y-%m-%d") AS startDate',
        'DATE_FORMAT(S.endDate, "%Y-%m-%d") AS endDate',
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
      .andWhere('IF(SA.sequence IS NOT NULL, SA.sequence = 1, true)')
      .andWhere('S.deletedAt IS NULL')
      .andWhere('SA.deletedAt IS NULL')
      .orderBy('S.startDate, S.createdAt')
      .getRawMany();
  }

  async selectSchedulesInCalendar(
    userId: number,
    calendarStartDay: string,
    calendarEndDay: string,
  ): Promise<ISchedulesInCalendar[]> {
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
      .andWhere(`S.startDate <= :endDay`, { endDay: calendarEndDay })
      .andWhere(`S.endDate >= :startDay`, { startDay: calendarStartDay })
      .andWhere('S.deletedAt IS NULL')
      .orderBy('S.startDate')
      .addOrderBy('S.createdAt')
      .getRawMany();
  }

  async updateById(
    scheduleId: number,
    properties: Partial<ScheduleEntity>,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(ScheduleEntity)
      .set(properties)
      .where('id = :id', { id: scheduleId })
      .andWhere('status = :status', { status: StatusColumnEnum.ACTIVE })
      .execute();
  }
}
