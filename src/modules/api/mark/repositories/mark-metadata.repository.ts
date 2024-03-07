import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { Repository } from 'typeorm';
import { MarkEntity } from '../entities/mark.entity';

@CustomRepository(MarkMetadataEntity)
export class MarkMetadataRepository extends Repository<MarkMetadataEntity> {
  /**
   * @summary MarkId로 MarkMetadata 조회하는 함수
   * @author  Jason
   * @param   { number } markId
   * @returns { MarkMetadataEntity[] }
   */
  async selectMarkMetadatasByMarkId(
    markId: number,
  ): Promise<MarkMetadataEntity[]> {
    return await this.createQueryBuilder('MMD')
      .select([
        'MMD.id AS id',
        'markId',
        'markImageKey',
        'markImageUrl',
        'caption',
        'isMainImage',
      ])
      .innerJoin(MarkEntity, 'M', 'M.id = MMD.markId')
      .where('MMD.markId = :markId', { markId })
      .orderBy('MMD.createdAt')
      .getRawMany();
  }
}
