import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkEntity } from '../entities/mark.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkEntity)
export class MarkRepository extends Repository<MarkEntity> {}
