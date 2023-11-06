import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkEntity } from '../entities/mark.entity';
import { Repository } from 'typeorm';
import { StatusColumnEnum } from 'src/constants/enum';

@CustomRepository(MarkEntity)
export class MarkRepository extends Repository<MarkEntity> {
  async selectMarkExceptCategoryCount(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('COUNT(*) AS markCount')
      .where('status = :status', { status: StatusColumnEnum.ACTIVE })
      .andWhere('userId = :userId', { userId })
      .andWhere('markCategoryId IS NULL')
      .getRawOne();
    return parseInt(result.markCount);
  }
}
