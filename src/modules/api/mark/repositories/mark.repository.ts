import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkEntity } from '../entities/mark.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkEntity)
export class MarkRepository extends Repository<MarkEntity> {
  async selectMarkExceptCategoryCount(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('COUNT(*) AS markCount')
      .andWhere('userId = :userId', { userId })
      .andWhere('markCategoryId IS NULL')
      .andWhere('deletedAt IS NULL')
      .getRawOne();
    return parseInt(result.markCount);
  }
}
