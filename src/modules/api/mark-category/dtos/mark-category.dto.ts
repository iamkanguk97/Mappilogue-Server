import { CheckColumnEnum } from 'src/constants/enum';

export class MarkCategoryDto {
  private readonly id: number;
  private readonly title: string;
  private readonly sequence: number;
  private readonly isMarkedInMap: CheckColumnEnum;

  constructor(
    id: number,
    title: string,
    sequence: number,
    isMarkedInMap: CheckColumnEnum,
  ) {
    this.id = id;
    this.title = title;
    this.sequence = sequence;
    this.isMarkedInMap = isMarkedInMap;
  }
}
