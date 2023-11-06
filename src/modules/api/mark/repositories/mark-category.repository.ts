import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';
import { StatusColumnEnum } from 'src/constants/enum';
import { MARK_CATEGORY_EMPTY_SEQUENCE } from '../../mark-category/constants/mark-category.constant';
import * as _ from 'lodash';
import { MarkEntity } from '../entities/mark.entity';
import { TMarkCategoryByUserId } from '../../mark-category/types';

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
        'MC.id = M.markCategoryId and M.status = :status',
        { status: StatusColumnEnum.ACTIVE },
      )
      .where('MC.userId = :userId', { userId })
      .andWhere('MC.status = :status', { status: StatusColumnEnum.ACTIVE })
      .groupBy('MC.id')
      .orderBy('MC.sequence')
      .getRawMany();
  }

  async selectLastMarkCategorySequenceNo(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('sequence')
      .where('userId = :userId', { userId })
      .andWhere('status = :status', { status: StatusColumnEnum.ACTIVE })
      .orderBy('sequence', 'DESC')
      .limit(1)
      .getRawOne();

    return _.isNil(result) ? MARK_CATEGORY_EMPTY_SEQUENCE : result.sequence;
  }
}
