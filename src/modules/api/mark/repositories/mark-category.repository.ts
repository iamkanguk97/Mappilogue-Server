import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';
import { StatusColumnEnum } from 'src/constants/enum';

@CustomRepository(MarkCategoryEntity)
export class MarkCategoryRepository extends Repository<MarkCategoryEntity> {
  async selectMarkCategoriesByUserId(
    userId: number,
  ): Promise<MarkCategoryEntity[]> {
    return await this.createQueryBuilder()
      .select(['id', 'title', 'isMarkedInMap'])
      .where('userId = :userId', { userId })
      .andWhere('status = :status', { status: StatusColumnEnum.ACTIVE })
      .orderBy('sequence')
      .getRawMany();
  }
}
