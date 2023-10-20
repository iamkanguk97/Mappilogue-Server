import { Repository } from 'typeorm';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import { CustomRepository } from 'src/modules/core/custom-repository/decorators';

@CustomRepository(UserAlarmSettingEntity)
export class UserAlarmSettingRepository extends Repository<UserAlarmSettingEntity> {
  async selectUserAlarmSettingById(
    userId: number,
  ): Promise<UserAlarmSettingEntity> {
    return await this.createQueryBuilder('userAlarm')
      .select('*')
      .where('userAlarm.userId = :userId', { userId })
      .andWhere('userAlarm.status = :status', {
        status: StatusColumnEnum.ACTIVE,
      })
      .getRawOne();
  }
}
