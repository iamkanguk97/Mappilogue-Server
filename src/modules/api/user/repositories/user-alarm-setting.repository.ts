import { Repository } from 'typeorm';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';

@CustomRepository(UserAlarmSettingEntity)
export class UserAlarmSettingRepository extends Repository<UserAlarmSettingEntity> {}
