import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ScheduleAreaEntity } from '../schedule-area.entity';
import { Repository } from 'typeorm';

@CustomRepository(ScheduleAreaEntity)
export class ScheduleAreaRepotory extends Repository<ScheduleAreaEntity> {}
