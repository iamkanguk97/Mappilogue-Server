import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';
import { MARK_CATEGORY_EMPTY_SEQUENCE } from '../../mark-category/constants/mark-category.constant';
import { MarkEntity } from '../entities/mark.entity';
import { TMarkCategoryByUserId } from '../../mark-category/types';
import { isDefined } from 'src/helpers/common.helper';

@CustomRepository(MarkCategoryEntity)
export class MarkCategoryRepository extends Repository<MarkCategoryEntity> {
  async selectMarkCategoriesByUserId(
    userId: number,
  ): Promise<TMarkCategoryByUserId[]> {
    return await this.createQueryBuilder('MC')
      .select([
        'MC.id AS id',
        'MC.title AS title',
        'MC.isMarkedInMap AS isMarkedInMap',
        'COUNT(M.id) AS markCount',
      ])
      .leftJoin(
        MarkEntity,
        'M',
        'MC.id = M.markCategoryId AND M.deletedAt IS NULL',
      )
      .where('MC.userId = :userId', { userId })
      .andWhere('MC.deletedAt IS NULL')
      .groupBy('MC.id')
      .orderBy('MC.sequence')
      .getRawMany();
  }

  async selectLastMarkCategorySequenceNo(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('sequence')
      .where('userId = :userId', { userId })
      .andWhere('deletedAt IS NULL')
      .orderBy('sequence', 'DESC')
      .limit(1)
      .getRawOne();

    return !isDefined(result) ? MARK_CATEGORY_EMPTY_SEQUENCE : result.sequence;
  }
}
