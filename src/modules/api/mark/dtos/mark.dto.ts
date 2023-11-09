import { MarkEntity } from 'src/modules/api/mark/entities/mark.entity';

export class MarkDto {
  private readonly id: number;
  private readonly userId: number;
  private readonly colorId: number;
  private readonly title: string;
  private readonly markCategoryId?: number | undefined;
  private readonly scheduleId?: number | undefined;
  private readonly content?: string | undefined;

  private constructor(
    id: number,
    userId: number,
    colorId: number,
    title: string,
    markCategoryId?: number | undefined,
    scheduleId?: number | undefined,
    content?: string | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.colorId = colorId;
    this.title = title;
    this.markCategoryId = markCategoryId;
    this.scheduleId = scheduleId;
    this.content = content;
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
    );
  }

  get getId(): number {
    return this.id;
  }

  get getMarkCategoryId(): number | undefined {
    return this.markCategoryId;
  }

  get getContent(): string | undefined {
    return this.content ?? '';
  }
}
