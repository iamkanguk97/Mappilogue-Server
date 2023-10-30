import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { ColorEntity } from '../entities/color.entity';
import { Repository } from 'typeorm';

@CustomRepository(ColorEntity)
export class ColorRepository extends Repository<ColorEntity> {}
