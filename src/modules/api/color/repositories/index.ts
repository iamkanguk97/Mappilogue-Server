import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { Repository } from 'typeorm';
import { ColorEntity } from '../entities';

@CustomRepository(ColorEntity)
export class ColorRepository extends Repository<ColorEntity> {}
