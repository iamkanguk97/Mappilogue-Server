import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import {
  SCHEDULE_DEFAULT_TITLE,
  SCHEDULE_TITLE_LENGTH,
} from '../constants/schedule.constant';
import { ColorEntity } from '../../color/entities/color.entity';
import { isDefined } from 'src/helpers/common.helper';
import { ScheduleAreaEntity } from './schedule-area.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('Schedule')
export class ScheduleEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('int')
  colorId!: number;

  @Column('varchar', {
    length: SCHEDULE_TITLE_LENGTH,
    default: SCHEDULE_DEFAULT_TITLE,
  })
  title!: string;

  @Column('date')
  startDate!: string;

  @Column('date')
  endDate!: string;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.CHECK,
  })
  isAlarm!: CheckColumnEnum;

  @ManyToOne(() => UserEntity, (user) => user.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => ColorEntity, (color) => color.schedules)
  @JoinColumn({ name: 'colorId', referencedColumnName: 'id' })
  color?: ColorEntity;

  @OneToMany(
    () => ScheduleAreaEntity,
    (scheduleArea) => scheduleArea.schedule,
    {
      cascade: true,
    },
  )
  scheduleAreas?: ScheduleAreaEntity[];

  static from(
    userId: number,
    colorId: number,
    startDate: string,
    endDate: string,
    title: string,
    alarmOptions: string[],
  ): ScheduleEntity {
    const schedule = new ScheduleEntity();

    schedule.userId = userId;
    schedule.colorId = colorId;
    schedule.startDate = startDate;
    schedule.endDate = endDate;
    schedule.title =
      !isDefined(title) || title.length === 0 ? SCHEDULE_DEFAULT_TITLE : title;
    schedule.isAlarm =
      !isDefined(alarmOptions) || alarmOptions.length === 0
        ? CheckColumnEnum.INACTIVE
        : CheckColumnEnum.ACTIVE;

    return schedule;
  }
}
