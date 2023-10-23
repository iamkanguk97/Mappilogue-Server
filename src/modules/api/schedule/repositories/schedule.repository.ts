import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Repository } from 'typeorm';

@CustomRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> {
  async insertSchedule(createScheduleEntity: ScheduleEntity): Promise<number> {
    console.log(createScheduleEntity);
    const result = await this.createQueryBuilder()
      .insert()
      .into(ScheduleEntity)
      .values(createScheduleEntity)
      .execute();
    return result.identifiers[0].id;
  }
}
