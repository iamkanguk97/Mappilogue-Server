import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkEntity } from '../entities/mark.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkEntity)
export class MarkRepository extends Repository<MarkEntity> {
  /**
   * @summary 카테고리가 없는 기록 개수 구하기
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<number> }
   */
  async selectMarkExceptCategoryCount(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('COUNT(*) AS markCount')
      .where('userId = :userId', { userId })
      .andWhere('markCategoryId IS NULL')
      .andWhere('deletedAt IS NULL')
      .getRawOne();
    return parseInt(result.markCount);
  }
}
