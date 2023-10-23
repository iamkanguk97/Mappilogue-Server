import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import {
  SCHEDULE_DEFAULT_TITLE,
  SCHEDULE_TITLE_LENGTH,
} from '../constants/schedule.constant';
import { ColorEntity } from '../../color/entities/color.entity';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { plainToClass } from 'class-transformer';

@Entity('Schedule')
export class ScheduleEntity extends DefaultColumnType {
  @Column('varchar', {
    nullable: true,
    length: SCHEDULE_TITLE_LENGTH,
    default: SCHEDULE_DEFAULT_TITLE,
  })
  title?: string | undefined;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @Column('varchar', {
    nullable: true,
    length: StatusOrCheckColumnLengthEnum.CHECK,
  })
  isAlarm: CheckColumnEnum;

  @ManyToOne(() => UserEntity, (user) => user.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => ColorEntity, (color) => color.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'colorId', referencedColumnName: 'id' })
  color: ColorEntity;

  static from(
    userId: number,
    createScheduleDto: PostScheduleRequestDto,
  ): ScheduleEntity {
    // const schedule = new ScheduleEntity();

    // schedule.title = createScheduleDto.title;
    // schedule.startDate = createScheduleDto.startDate;
    // schedule.endDate = createScheduleDto.endDate;
    // schedule.isAlarm = setCheckColumnByValue(createScheduleDto.alarmOptions);
    // schedule.user = userId;

    // return schedule;
    const schedule = plainToClass(ScheduleEntity, {
      userId,
      ...createScheduleDto,
    });
    console.log(schedule);
    return schedule;
  }
}
