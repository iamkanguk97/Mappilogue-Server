import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { Repository } from 'typeorm';
import { MarkEntity } from '../entities/mark.entity';
import { ScheduleAreaEntity } from '../../schedule/entities/schedule-area.entity';

@CustomRepository(MarkLocationEntity)
export class MarkLocationRepository extends Repository<MarkLocationEntity> {
  /**
   * @summary ScheduleAreaId가 있을 때 MarkLocation을 가져오는 함수
   * @author Jason
   * @param { number } markId
   * @returns { MarkLocationEntity }
   */
  async selectMarkLocationWithScheduleArea(
    markId: number,
  ): Promise<MarkLocationEntity> {
    return await this.createQueryBuilder('ML')
      .select('ML.scheduleAreaId', 'scheduleAreaId')
      .addSelect('IFNULL(SA.name, "")', 'name')
      .addSelect('IFNULL(SA.streetAddress, "")', 'streetAddress')
      .addSelect('IFNULL(SA.latitude, "")', 'latitude')
      .addSelect('IFNULL(SA.longitude, "")', 'longitude')
      .innerJoin(MarkEntity, 'M', 'ML.markId = M.id')
      .innerJoin(ScheduleAreaEntity, 'SA', 'SA.id = ML.scheduleAreaId')
      .where('ML.markId = :markId', { markId })
      .andWhere('M.deletedAt IS NULL')
      .andWhere('SA.deletedAt IS NULL')
      .andWhere('ML.deletedAt IS NULL')
      .getRawOne();
  }
}
