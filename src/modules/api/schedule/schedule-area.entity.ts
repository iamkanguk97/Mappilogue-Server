import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('ScheduleArea')
export class ScheduleAreaEntity extends DefaultColumnType {
  @Column('int')
  scheduleId: number;

  @Column('varchar', { length: 30 })
  name!: string;

  @Column('varchar', { length: 20 })
  date!: string;

  @Column('varchar', { length: 100 })
  streetAddress!: string;

  @Column('varchar', { length: 100 })
  latitude!: string;

  @Column('varchar', { length: 100 })
  longitude!: string;

  @Column('varchar', {
    nullable: true,
    length: 10,
  })
  time?: string;

  @Column('int')
  sequence!: number;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.scheduleArea, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'id' })
  schedule: ScheduleEntity;
}
