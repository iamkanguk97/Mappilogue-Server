import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MARK_CATEGORY_TITLE_LENGTH } from '../../mark-category/constants/mark-category.constant';
import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { MarkCategoryDto } from '../../mark-category/dtos/mark-category.dto';

@Entity('MarkCategory')
export class MarkCategoryEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('varchar', { length: MARK_CATEGORY_TITLE_LENGTH })
  title: string;

  @Column('int')
  sequence: number;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.STATUS,
    default: CheckColumnEnum.INACTIVE,
  })
  isMarkedInMap: CheckColumnEnum;

  @ManyToOne(() => UserEntity, (user) => user.markCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  static toDto(markCategories: MarkCategoryEntity[]): MarkCategoryDto[] {
    return markCategories.map(
      (markCategory) =>
        new MarkCategoryDto(
          markCategory.id,
          markCategory.title,
          markCategory.sequence,
          markCategory.isMarkedInMap,
        ),
    );
  }

  static from(
    userId: number,
    title: string,
    sequence: number,
  ): MarkCategoryEntity {
    const markCategory = new MarkCategoryEntity();

    markCategory.userId = userId;
    markCategory.title = title;
    markCategory.sequence = sequence;

    return markCategory;
  }
}
