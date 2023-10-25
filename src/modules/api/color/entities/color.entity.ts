import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColorCodeLength, ColorNameLength } from '../constants/color.enum';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';

@Entity('Color')
export class ColorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column('varchar', { length: ColorNameLength.MAX })
  name: string;

  @Column('varchar', { length: ColorCodeLength.MAX })
  code: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.color)
  schedules: ScheduleEntity[];

  static async selectColorList(): Promise<ColorEntity[]> {
    return await this.createQueryBuilder('color').getMany();
  }
}
