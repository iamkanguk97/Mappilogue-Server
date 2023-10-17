import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ProcessedSocialKakaoInfo } from '../types';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async selectUserBySnsId(snsId: string): Promise<UserEntity> {
    return await this.createQueryBuilder('user')
      .where('user.snsId = :snsId', { snsId })
      .andWhere('user.status = :status', { status: 'ACTIVE' })
      .getOne();
  }

  async selectUserById(id: number): Promise<UserEntity> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere('user.status = :status', { status: 'ACTIVE' })
      .getOne();
  }

  async insertUser(
    userInfo: ProcessedSocialKakaoInfo & { fcmToken?: string | undefined },
  ): Promise<number> {
    const result = await this.createQueryBuilder('user')
      .insert()
      .into(UserEntity)
      .values(userInfo)
      .execute();
    return result.identifiers[0].id;
  }
}
