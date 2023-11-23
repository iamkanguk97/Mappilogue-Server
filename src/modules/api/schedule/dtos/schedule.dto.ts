import { Exclude, Expose } from 'class-transformer';
import { CheckColumnEnum } from 'src/constants/enum';
import { ScheduleEntity } from '../entities/schedule.entity';

export class ScheduleDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _colorId: number;
  @Exclude() private readonly _title?: string | undefined;
  @Exclude() private readonly _isAlarm: CheckColumnEnum;

  @Exclude() private _startDate: string;
  @Exclude() private _endDate: string;
  @Exclude() private _colorCode?: string | undefined;

  private constructor(
    id: number,
    userId: number,
    colorId: number,
    startDate: string,
    endDate: string,
    isAlarm: CheckColumnEnum,
    title?: string | undefined,
  ) {
    this._id = id;
    this._userId = userId;
    this._colorId = colorId;
    this._startDate = startDate;
    this._endDate = endDate;
    this._isAlarm = isAlarm;
    this._title = title;
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

  @Expose()
  get getId(): number {
    return this._id;
  }

  @Expose()
  get getUserId(): number {
    return this._userId;
  }

  @Expose()
  get getStartDate(): string {
    return this._startDate;
  }

  @Expose()
  get getEndDate(): string {
    return this._endDate;
  }

  @Expose()
  get getColorId(): number {
    return this._colorId;
  }

  @Expose()
  get getColorCode(): string | undefined {
    return this._colorCode;
  }

  @Expose()
  get getIsAlarm(): CheckColumnEnum {
    return this._isAlarm;
  }

  set setStartDate(startDate: string) {
    this._startDate = startDate;
  }

  set setEndDate(endDate: string) {
    this._endDate = endDate;
  }

  set setColorCode(colorCode: string) {
    this._colorCode = colorCode;
  }
}
