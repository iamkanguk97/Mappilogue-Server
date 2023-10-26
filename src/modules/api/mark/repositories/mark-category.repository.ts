import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { Repository } from 'typeorm';

@CustomRepository(MarkCategoryEntity)
export class MarkCategoryRepository extends Repository<MarkCategoryEntity> {}
