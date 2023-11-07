import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkLocationEntity)
export class MarkLocationRepository extends Repository<MarkLocationEntity> {}
