import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';
import { MARK_CATEGORY_EMPTY_SEQUENCE } from '../constants/mark-category.constant';
import { MarkEntity } from '../entities/mark.entity';
import { isDefined } from 'src/helpers/common.helper';
import { IMarkCategoryWithMarkCount } from '../types';

@CustomRepository(MarkCategoryEntity)
export class MarkCategoryRepository extends Repository<MarkCategoryEntity> {
  /**
   * @summary 사용자의 기록 카테고리 리스트 조회
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<IMarkCategoryWithMarkCount[]> }
   */
  async selectMarkCategoriesByUserId(
    userId: number,
  ): Promise<IMarkCategoryWithMarkCount[]> {
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

  /**
   * @summary 마지막 기록 카테고리 순서 번호를 가져옴
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<number> }
   */
  async selectLastMarkCategorySequenceNo(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('sequence')
      .where('userId = :userId', { userId })
      .andWhere('deletedAt IS NULL')
      .orderBy('sequence', 'DESC')
      .limit(1)
      .getRawOne();

    return !isDefined(result)
      ? MARK_CATEGORY_EMPTY_SEQUENCE
      : Number(result.sequence);
  }
}
