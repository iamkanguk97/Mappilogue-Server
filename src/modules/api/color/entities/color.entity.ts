import { Column, Entity, OneToMany } from 'typeorm';
import {
  EColorCodeLength,
  EColorNameLength,
} from '../variables/enums/color.enum';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('Color')
export class ColorEntity extends CommonEntity {
  @Column('varchar', { length: EColorNameLength.MAX })
  name!: string;

  @Column('varchar', { length: EColorCodeLength.MAX })
  code!: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.color)
  schedules?: ScheduleEntity[];

  /** <10/30>
   * @deprecated Repository 적용으로 인한 deprecated
   */
  // static async selectColorList(): Promise<ColorEntity[]> {
  //   return await this.createQueryBuilder('color').getMany();
  // }
}
