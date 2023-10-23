import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserAlarmHistoryEntity } from '../entities/user-alarm-history.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserAlarmHistoryEntity)
export class UserAlarmHistoryRepository extends Repository<UserAlarmHistoryEntity> {}
