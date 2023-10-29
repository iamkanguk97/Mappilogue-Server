import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import {
  ScheduleAreaNameLengthEnum,
  ScheduleAreaStreetAddressLengthEnum,
} from '../constants/schedule.enum';

@Entity('ScheduleArea')
export class ScheduleAreaEntity extends DefaultColumnType {
  @Column('int')
  scheduleId: number;

  @Column('varchar', { length: ScheduleAreaNameLengthEnum.MAX })
  name!: string;

  @Column('varchar', { length: 20 })
  date!: string;

  @Column('varchar', { length: ScheduleAreaStreetAddressLengthEnum.MAX })
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

  static from(
    scheduleId: number,
    name: string,
    date: string,
    streetAddress: string,
    latitude: string,
    longitude: string,
    sequence: number,
    time?: string | undefined,
  ) {
    const scheduleArea = new ScheduleAreaEntity();

    scheduleArea.scheduleId = scheduleId;
    scheduleArea.name = name;
    scheduleArea.date = date;
    scheduleArea.streetAddress = streetAddress;
    scheduleArea.latitude = latitude;
    scheduleArea.longitude = longitude;
    scheduleArea.sequence = sequence;
    scheduleArea.time = time;

    return scheduleArea;
  }
}
