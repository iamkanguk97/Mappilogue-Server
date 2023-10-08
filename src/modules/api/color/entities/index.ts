import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColorCodeLength, ColorNameLength } from '../constants';

@Entity('Color')
export class ColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: ColorNameLength.MAX })
  name: string;

  @Column('varchar', { length: ColorCodeLength.MAX })
  code: string;
}
