import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import {
  IScheduleListInHomeOnToday,
  ISchedulesInCalendar,
  ISchedulesOnSpecificDate,
  TSchedulesByYearAndMonth,
} from '../types';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { SCHEDULE_DEFAULT_TITLE } from '../constants/schedule.constant';

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

  /**
   * @summary 홈화면 조회 -> 오늘의 일정 리스트 가져오기
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<IScheduleListInHomeOnToday[]> }
   */
  async selectScheduleListInHomeOnToday(
    userId: number,
  ): Promise<IScheduleListInHomeOnToday[]> {
    return await this.createQueryBuilder('S')
      .select('S.id', 'id')
      .addSelect(
        `IF(S.title = "" OR ISNULL(S.title), "${SCHEDULE_DEFAULT_TITLE}", S.title)`,
        'title',
      )
      .addSelect('S.colorId', 'colorId')
      .addSelect('C.code', 'colorCode')
      .innerJoin(ColorEntity, 'C', 'C.id = S.colorId')
      .where('S.startDate <= DATE_FORMAT(NOW(), "%Y-%m-%d")')
      .andWhere('S.endDate >= DATE_FORMAT(NOW(), "%Y-%m-%d")')
      .andWhere('S.userId = :userId', { userId })
      .andWhere('S.deletedAt IS NULL')
      .andWhere('C.deletedAt IS NULL')
      .orderBy('S.startDate')
      .getRawMany();
  }

  async selectScheduleListInHomeOnAfter(userId: number) {
    return;
  }

  /**
   * @summary 날짜로 일정과 해당하는 지역 가져오기
   * @author  Jason
   * @param   { number } userId
   * @param   { string } date
   * @returns { Promise<TSchedulesByYearAndMonth> }
   */
  async selectSchedulesByYearAndMonth(
    userId: number,
    date: string,
  ): Promise<TSchedulesByYearAndMonth> {
    return await this.createQueryBuilder('S')
      .select([
        'S.id AS scheduleId',
        'DATE_FORMAT(S.startDate, "%Y-%m-%d") AS startDate',
        'DATE_FORMAT(S.endDate, "%Y-%m-%d") AS endDate',
        'S.title AS title',
        'S.colorId AS colorId',
        'C.code AS colorCode',
        'SA.id AS scheduleAreaId',
        'SA.name AS areaName',
        'SA.time AS areaTime',
      ])
      .innerJoin(ColorEntity, 'C', 'C.id = S.colorId')
      .leftJoin(
        ScheduleAreaEntity,
        'SA',
        'SA.scheduleId = S.id AND SA.date = :date AND SA.sequence = 1',
        { date },
      )
      .where('S.userId = :userId', { userId })
      .andWhere(':date BETWEEN S.startDate AND S.endDate', { date })
      .andWhere('S.deletedAt IS NULL')
      .andWhere('SA.deletedAt IS NULL')
      .orderBy('S.startDate')
      .getRawMany();
  }
}
