import { CommonEntity } from 'src/common/entities/common.entity';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'ScheduleAlarm' })
export class ScheduleAlarmEntity extends CommonEntity {
  @Column('int')
  scheduleId!: number;

  @Column('varchar', {
    length: 100,
    nullable: true,
  })
  body!: string | null;

  @Column('varchar', {
    length: 20,
  })
  type!: NotificationTypeEnum;
}
