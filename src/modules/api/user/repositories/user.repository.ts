import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async selectUserBySnsId(snsId: string) {
    return await this.createQueryBuilder('user')
      .where('user.snsId = :snsId', { snsId })
      .andWhere('user.status = :status', { status: 'ACTIVE' })
      .getOne();
  }
}
