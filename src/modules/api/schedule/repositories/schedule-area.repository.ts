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
      .addSelect('IFNULL(SA.name, "")', 'name')
      .addSelect('IFNULL(SA.streetAddress, "")', 'streetAddress')
      .addSelect('IFNULL(SA.latitude, "")', 'latitude')
      .addSelect('IFNULL(SA.longitude, "")', 'longitude')
      .addSelect('IFNULL(SA.time, "")', 'time')
      .addSelect('SA.date', 'date')
      .where('SA.scheduleId = :scheduleId', { scheduleId })
      .andWhere('SA.date = DATE_FORMAT(NOW(), "%Y-%m-%d")')
      .orderBy('SA.sequence', 'ASC')
      .getRawMany();
  }
}
