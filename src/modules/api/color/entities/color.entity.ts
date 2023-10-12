import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColorCodeLength, ColorNameLength } from '../constants/color.enum';

@Entity('Color')
export class ColorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: ColorNameLength.MAX })
  name: string;

  @Column('varchar', { length: ColorCodeLength.MAX })
  code: string;

  static async findColorList(): Promise<ColorEntity[]> {
    return await this.createQueryBuilder('color').getMany();
  }
}
