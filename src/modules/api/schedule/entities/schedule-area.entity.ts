import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import {
  ScheduleAreaLatitudeLengthEnum,
  ScheduleAreaLongitudeLengthEnum,
  ScheduleAreaNameLengthEnum,
  ScheduleAreaStreetAddressLengthEnum,
  ScheduleAreaTimeLengthEnum,
} from '../constants/schedule.enum';
import { SCHEDULE_AREA_DATE_LENGTH } from '../constants/schedule.constant';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('ScheduleArea')
export class ScheduleAreaEntity extends CommonEntity {
  @Column('int')
  scheduleId!: number;

  @Column('varchar', { length: ScheduleAreaNameLengthEnum.MAX })
  name!: string;

  @Column('varchar', { length: SCHEDULE_AREA_DATE_LENGTH })
  date!: string;

  @Column('varchar', {
    nullable: true,
    length: ScheduleAreaStreetAddressLengthEnum.MAX,
  })
  streetAddress!: string | null;

  @Column('varchar', {
    nullable: true,
    length: ScheduleAreaLatitudeLengthEnum.MAX,
  })
  latitude!: string | null;

  @Column('varchar', {
    nullable: true,
    length: ScheduleAreaLongitudeLengthEnum.MAX,
  })
  longitude!: string | null;

  @Column('varchar', {
    nullable: true,
    length: ScheduleAreaTimeLengthEnum.MAX,
  })
  time!: string | null;

  @Column('int')
  sequence!: number;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.scheduleAreas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'id' })
  schedule?: ScheduleEntity;

  static from(
    scheduleId: number,
    name: string,
    date: string,
    sequence: number,
    streetAddress: string | null,
    latitude: string | null,
    longitude: string | null,
    time: string | null,
  ) {
    const scheduleArea = new ScheduleAreaEntity();

    scheduleArea.scheduleId = scheduleId;
    scheduleArea.name = name;
    scheduleArea.date = date;
    scheduleArea.sequence = sequence;
    scheduleArea.streetAddress = streetAddress;
    scheduleArea.latitude = latitude;
    scheduleArea.longitude = longitude;
    scheduleArea.time = time;

    return scheduleArea;
  }
}
