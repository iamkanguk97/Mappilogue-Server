import { CheckColumnEnum } from 'src/constants/enum';
import { ScheduleEntity } from '../entities/schedule.entity';

export class ScheduleDto {
  private readonly id: number;
  private readonly userId: number;
  private readonly colorId: number;
  private readonly title?: string | undefined;
  private startDate: string;
  private endDate: string;
  private readonly isAlarm: CheckColumnEnum;

  private constructor(
    id: number,
    userId: number,
    colorId: number,
    startDate: string,
    endDate: string,
    isAlarm: CheckColumnEnum,
    title?: string | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.colorId = colorId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isAlarm = isAlarm;
    this.title = title;
  }

  static from(scheduleEntity: ScheduleEntity): ScheduleDto {
    return new ScheduleDto(
      scheduleEntity.id,
      scheduleEntity.userId,
      scheduleEntity.colorId,
      scheduleEntity.startDate,
      scheduleEntity.endDate,
      scheduleEntity.isAlarm,
      scheduleEntity.title,
    );
  }

  get _id(): number {
    return this.id;
  }
  get getStartDate(): string {
    return this.startDate;
  }
  get getEndDate(): string {
    return this.endDate;
  }

  set _startDate(newStartDate: string) {
    this.startDate = newStartDate;
  }
  set _endDate(newEndDate: string) {
    this.endDate = newEndDate;
  }
}
