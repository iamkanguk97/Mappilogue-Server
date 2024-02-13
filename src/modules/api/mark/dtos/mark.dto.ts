import { Exclude, Expose } from 'class-transformer';
import { MarkEntity } from 'src/modules/api/mark/entities/mark.entity';

import * as moment from 'moment';

export class MarkDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _colorId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _markCategoryId?: number;
  @Exclude() private readonly _scheduleId?: number;
  @Exclude() private readonly _content?: string;
  @Exclude() private readonly _createdAt?: Date;

  private constructor(
    id: number,
    userId: number,
    colorId: number,
    title: string,
    markCategoryId?: number,
    scheduleId?: number,
    content?: string,
    createdAt?: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._colorId = colorId;
    this._title = title;
    this._markCategoryId = markCategoryId;
    this._scheduleId = scheduleId;
    this._content = content;
    this._createdAt = createdAt;
  }

  static of(markEntity: MarkEntity): MarkDto {
    return new MarkDto(
      markEntity.id,
      markEntity.userId,
      markEntity.colorId,
      markEntity.title,
      markEntity.markCategoryId,
      markEntity.scheduleId,
      markEntity.content,
      markEntity.createdAt,
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  get colorId(): number {
    return this._colorId;
  }

  @Expose()
  get title(): string {
    return this._title;
  }

  @Expose()
  get markCategoryId(): number | undefined {
    return this._markCategoryId;
  }

  @Expose()
  get scheduleId(): number {
    return this._scheduleId;
  }

  @Expose()
  get content(): string | undefined {
    return this._content ?? '';
  }

  get createdAt(): string {
    return moment(this._createdAt).format('Y년 M월 D일');
  }
}
