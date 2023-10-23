import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColorCodeLength, ColorNameLength } from '../constants/color.enum';
import { ColorDto } from '../dtos/color.dto';
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

  static toDto(colors: ColorEntity[]): ColorDto[] {
    return colors.map(
      (color) => new ColorDto(color.id, color.name, color.code),
    );
  }

  static async selectColorList(): Promise<ColorEntity[]> {
    return await this.createQueryBuilder('color').getMany();
  }
}
