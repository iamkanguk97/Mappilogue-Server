import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../entities/schedule.entity';
import { IScheduleAreasById } from '../types';
import { MarkLocationEntity } from '../../mark/entities/mark-location.entity';
import { ECheckColumn } from 'src/constants/enum';

@CustomRepository(ScheduleAreaEntity)
export class ScheduleAreaRepository extends Repository<ScheduleAreaEntity> {
  /**
   * @summary 특정 일정의 장소 리스트 조회하기
   * @author  Jason
   * @param   { number } scheduleId
   * @param   { boolean } locationCond
   * @returns { Promise<IScheduleAreasById> }
   */
  async selectScheduleAreasById(
    scheduleId: number,
    locationCond: boolean,
  ): Promise<IScheduleAreasById[]> {
    const queryBuilder = this.createQueryBuilder('SA')
      .select([
        'SA.id AS scheduleAreaId',
        'SA.scheduleId AS scheduleId',
        'SA.date AS date',
        'SA.name AS name',
        'SA.streetAddress AS streetAddress',
        'SA.latitude AS latitude',
        'SA.longitude AS longitude',
        'SA.time AS time',
        'SA.sequence AS sequence',
        `IF(ML.scheduleAreaId IS NULL, "${ECheckColumn.INACTIVE}", "${ECheckColumn.ACTIVE}") AS isRepLocation`,
      ])
      .innerJoin(ScheduleEntity, 'S', 'S.id = SA.scheduleId')
      .leftJoin(MarkLocationEntity, 'ML', 'SA.id = ML.scheduleAreaId')
      .where('SA.scheduleId = :scheduleId', { scheduleId })
      .andWhere('SA.deletedAt IS NULL')
      .andWhere('S.deletedAt IS NULL')
      .andWhere('ML.deletedAt IS NULL');

    if (locationCond) {
      return await queryBuilder
        .orderBy(`isRepLocation = "${ECheckColumn.ACTIVE}"`, 'DESC')
        .addOrderBy('SA.date')
        .addOrderBy('SA.sequence')
        .getRawMany();
    }
    return await queryBuilder
      .orderBy('SA.date')
      .addOrderBy('SA.sequence')
      .getRawMany();
  }

  /**
   * @summary 홈화면 조회 -> 각 일정에 해당하는 장소 리스트 가져오기
   * @author  Jason
   * @param   { number } scheduleId
   * @returns { Promise<ScheduleAreaEntity[]> }
   */
  async selectScheduleAreaListById(
    scheduleId: number,
  ): Promise<ScheduleAreaEntity[]> {
    return await this.createQueryBuilder('SA')
      .select('SA.id', 'id')
      .addSelect('SA.name', 'name')
      .addSelect('SA.streetAddress', 'streetAddress')
      .addSelect('SA.latitude', 'latitude')
      .addSelect('SA.longitude', 'longitude')
      .addSelect('SA.time', 'time')
      .addSelect('SA.date', 'date')
      .where('SA.scheduleId = :scheduleId', { scheduleId })
      .andWhere('SA.date = DATE_FORMAT(NOW(), "%Y-%m-%d")')
      .orderBy('SA.sequence', 'ASC')
      .getRawMany();
  }
}
