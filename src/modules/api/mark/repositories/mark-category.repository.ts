import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';
import { StatusColumnEnum } from 'src/constants/enum';
import { MARK_CATEGORY_EMPTY_SEQUENCE } from '../../mark-category/constants/mark-category.constant';
import * as _ from 'lodash';

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
