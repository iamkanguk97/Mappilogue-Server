import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkMetadataEntity)
export class MarkMetadataRepository extends Repository<MarkMetadataEntity> {}
