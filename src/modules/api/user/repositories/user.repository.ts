import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ProcessedSocialKakaoInfo } from '../types';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
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

  async updateById(
    userId: number,
    properties: Partial<UserEntity>,
  ): Promise<void> {
    await this.createQueryBuilder('user')
      .update(UserEntity)
      .set(properties)
      .where('id = :id', { id: userId })
      .execute();
  }
}
