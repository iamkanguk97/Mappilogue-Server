import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { Repository } from 'typeorm';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';

@CustomRepository(MarkMetadataEntity)
export class MarkMetadataRepository extends Repository<MarkMetadataEntity> {
  async selectMarkMetadatasByMarkId(
    markId: number,
  ): Promise<MarkMetadataEntity[]> {
    return await this.createQueryBuilder('MMD')
      .select([
        'MMD.id AS markMetadataId',
        'MMD.markId AS markId',
        'markImageUrl',
        'IFNULL(caption, "") AS caption',
        'isMainImage',
      ])
      .innerJoin(MarkEntity, 'M', 'M.id = MMD.markId')
      .where('MMD.markId = :markId', { markId })
      .andWhere('MMD.status = :status', { status: StatusColumnEnum.ACTIVE })
      .andWhere('M.status = :status', { status: StatusColumnEnum.ACTIVE })
      .orderBy('MMD.id')
      .getRawMany();
  }
}
