import { CheckColumnEnum } from 'src/constants/enum';
import { ScheduleEntity } from '../entities/schedule.entity';

export class ScheduleDto {
  private readonly id: number;
  private readonly userId: number;
  private readonly colorId: number;
<<<<<<< Updated upstream
=======
  private readonly title?: string | undefined;
  private startDate: string;
  private endDate: string;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  private readonly isAlarm: CheckColumnEnum;
  private readonly title?: string | undefined;

  private startDate: string;
  private endDate: string;
  private colorCode?: string | undefined;

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

  static of(scheduleEntity: ScheduleEntity): ScheduleDto {
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

  get getId(): number {
    return this.id;
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  get getUserId(): number {
    return this.userId;
  }

  get getStartDate(): string {
    return this.startDate;
  }

  get getEndDate(): string {
    return this.endDate;
  }

  get getColorId(): number {
    return this.colorId;
  }

  get getColorCode(): string | undefined {
    return this.colorCode;
  }

  get getIsAlarm(): CheckColumnEnum {
    return this.isAlarm;
  }

  set setStartDate(newStartDate: string) {
    this.startDate = newStartDate;
  }

  set setEndDate(newEndDate: string) {
    this.endDate = newEndDate;
  }

  set setColorCode(newColorCode: string) {
    this.colorCode = newColorCode;
  }
=======
=======
>>>>>>> Stashed changes
  set _startDate(newStartDate: string) {
    this.startDate = newStartDate;
  }
  set _endDate(newEndDate: string) {
    this.endDate = newEndDate;
  }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
